const express = require('express')
const consola = require('consola')
const sql = require('mssql')
const moment = require('moment')
const request = require('request-promise')
const bodyParser = require('body-parser')
const { Nuxt } = require('nuxt')
const app = express()

const logger = require('./debuger')('SERVER')
const auth = require('./authication')
let lineMonitor = require('./line/flex-monitor')
let lineNone = require('./line/flex-none')
// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
const db = require('./db')
const mongodb = require('./mongodb')
config.dev = !(process.env.NODE_ENV === 'production')
const hostName = `10.0.80.52:3001`
const groupKey = process.env.LINE_API || 'Ca2338af8e1ae465a2541acde69cd4e0c'
const sendLINE = async (body) => {
  await request({ method: 'PUT', url: `http://10.101.147.48:3000/cmgpos-bot/${groupKey}`, body, json: true })
  logger.info('LINE pushMessage.')
}
const sqlConnectionPool = db => new Promise((resolve, reject) => {
  const conn = new sql.ConnectionPool(db)
  conn.connect(err => {
    if (err) return reject(err)
    resolve(conn)
  })
})

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const host = process.env.HOST || '127.0.0.1'
  const port = process.env.PORT || 3001

  // Build only in dev mode
  app.use((req, res, next) => {
    const methodAllow = [ 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT' ]
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Methods', methodAllow.join(','))
    if (req.method === 'OPTIONS') return res.sendStatus(200)
    next()
  })

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  app.use(auth.path, auth.handler)

  app.get('/api/list', async (req, res) => {
    let pool = { close: () => {} }
    try {
      pool = await sqlConnectionPool(db[config.dev ? 'dev' : 'prd'])
      let sql = 'SELECT nTaskDetailId, sSubject, ISNULL(sDetail,\'\') sDetail, sDescription, sSolve, nOrder FROM SURVEY_CMG..UserTaskDetail WHERE bEnabled = 1 ORDER BY nOrder ASC'
      let [ records ] = (await pool.request().query(sql)).recordsets
      res.json(records)
    } catch (ex) {
      logger.error(ex)
    } finally {
      pool.close()
      res.end()
    }
  })

  app.get('/api/history', async (req, res) => {
    let page = parseInt(req.query.p || 1)
    if (isNaN(page)) return res.json([])
    let pool = { close: () => {} }
    try {
      let sql = `
      SELECT * FROM (
        SELECT ROW_NUMBER() OVER (ORDER BY g.dCreated DESC) AS nRow
          , g.sKey, sUsername, sName, g.dCreated, MAX(g.dModified) dModified
          , SUM(CASE WHEN sStatus = 'FAIL' THEN 1 ELSE 0 END) nFail
          , SUM(CASE WHEN sStatus = 'WARN' THEN 1 ELSE 0 END) nWarn
          , SUM(CASE WHEN sStatus = 'INFO' THEN 1 ELSE 0 END) nInfo
          , SUM(CASE WHEN sStatus = 'PASS' THEN 1 ELSE 0 END) nPass
        FROM SURVEY_CMG..UserTaskSubmit s
        INNER JOIN (
          SELECT CONVERT(VARCHAR,dCheckIn,112) + REPLACE(CONVERT(VARCHAR,dCheckIn,114), ':', '') sKey, nTaskDetailId, MAX(nIndex) nIndex
		      , CONVERT(VARCHAR, MIN(dCreated), 120) dCreated
          , CONVERT(VARCHAR, MAX(dCreated), 120) dModified
          FROM SURVEY_CMG..UserTaskSubmit
          GROUP BY CONVERT(VARCHAR,dCheckIn,112) + REPLACE(CONVERT(VARCHAR,dCheckIn,114), ':', ''), nTaskDetailId
        ) g ON g.nIndex = s.nIndex
        GROUP BY g.sKey, sUsername, sName, g.dCreated
      ) AS r WHERE nRow >= ${page} * 100 - 99 AND nRow <= ${page} * 100
      `
      pool = await sqlConnectionPool(db[config.dev ? 'dev' : 'prd'])
      let [ records ] = (await pool.request().query(sql)).recordsets
      return res.json(records)
    } catch (ex) {
      logger.error(ex)
    } finally {
      pool.close()
      res.end()
    }
  })

  app.get('/api/history/:id', async (req, res) => {
    let key = req.params.id
    let pool = { close: () => {} }
    let dCheckIn = moment(key, 'YYYYMMDDHHmmssSSS')
    if (!moment.isMoment(dCheckIn)) return res.json({})
    try {
      let sql = `
      SELECT s.nIndex, s.nTaskDetailId, s.sName, t.sSubject, ISNULL(t.sDetail,'') sDetail
        , ISNULL(t.sSolve,'') sSolve, t.nOrder, sStatus, sRemark, nVersion
      FROM UserTaskSubmit s
      INNER JOIN UserTaskDetail t ON t.nTaskDetailId = s.nTaskDetailId
      INNER JOIN (
        SELECT MAX(nIndex) nIndex  FROM UserTaskSubmit
        WHERE dCheckIn = CONVERT(DATETIME, '${dCheckIn.format('YYYY-MM-DD HH:mm:ss.SSS')}')
        GROUP BY nTaskDetailId
      ) i ON i.nIndex = s.nIndex
      ORDER BY s.nOrder ASC, nVersion DESC, s.dCreated ASC
      `
      pool = await sqlConnectionPool(db[config.dev ? 'dev' : 'prd'])
      let [ records ] = (await pool.request().query(sql)).recordsets
      let editor = []
      records = records.map(e => {
        if (editor.indexOf(e['sName']) === -1) editor.push(e['sName'])
        e.selected = e['sStatus'] === 'PASS'
        e.problem = e['sStatus'] !== 'PASS'
        e.status = e['sStatus']
        e.reason = e['sRemark']
        delete e['sStatus']
        delete e['sRemark']
        return e
      })
      return res.json({ editor: editor.join(', '), records: records })
    } catch (ex) {
      logger.error(ex)
    } finally {
      pool.close()
      res.end()
    }
  })

  app.get('/api/version/:id', async (req, res) => {
    let key = parseInt(req.params.id)
    if (isNaN(key)) return res.json({})
    let pool = { close: () => {} }
    let dCheckIn = moment(req.params.id, 'YYYYMMDDHHmmssSSS')
    if (!moment.isMoment(dCheckIn)) return res.json({})
    try {
      let sql = `
      SELECT s.nTaskDetailId, s.sName, t.sSubject, ISNULL(t.sDetail,'') sDetail, sStatus, sRemark, nVersion, CONVERT(VARCHAR, s.dCreated, 120) dCreated
      FROM UserTaskSubmit s
      INNER JOIN UserTaskDetail t ON t.nTaskDetailId = s.nTaskDetailId
      WHERE dCheckIn = CONVERT(DATETIME, '${dCheckIn.format('YYYY-MM-DD HH:mm:ss.SSS')}')
      ORDER BY s.nOrder ASC, nVersion DESC
      `
      pool = await sqlConnectionPool(db[config.dev ? 'dev' : 'prd'])
      let [ records ] = (await pool.request().query(sql)).recordsets
      let editor = []
      records = records.map(e => {
        if (editor.indexOf(e['sName']) === -1) editor.push(e['sName'])
        e.selected = e['sStatus'] === 'PASS'
        e.problem = e['sStatus'] !== 'PASS'
        e.status = e['sStatus']
        e.reason = e['sRemark']
        delete e['sStatus']
        delete e['sRemark']
        return e
      })
      return res.json({ editor: editor.join(', '), records: records })
    } catch (ex) {
      logger.error(ex)
    } finally {
      pool.close()
      res.end()
    }
  })

  app.get('/api/history/del/:id', async (req, res) => {
    let key = parseInt(req.params.id)
    if (isNaN(key)) return res.json({})
    let pool = { close: () => {} }
    logger.info('History ID:', req.params.id, 'Deleted.')
    let dCheckIn = moment(req.params.id, 'YYYYMMDDHHmmssSSS')
    if (!moment.isMoment(dCheckIn)) return res.json({})
    try {
      let sql = `DELETE FROM UserTaskSubmit WHERE dCheckIn = CONVERT(DATETIME, '${dCheckIn.format('YYYY-MM-DD HH:mm:ss.SSS')}')`
      pool = await sqlConnectionPool(db[config.dev ? 'dev' : 'prd'])
      await pool.request().query(sql)
      return res.json({})
    } catch (ex) {
      logger.error(ex)
    } finally {
      pool.close()
      res.end()
    }
  })
  app.get('/api/check-last/:hour', async (req, res) => {
    let pool = { close: () => {} }
    try {
      let hour = parseInt(req.params.hour)
      if (isNaN(hour)) throw new Error('Hour param not int.')
      let command = `
      SELECT COUNT(*) nTask FROM UserTaskSubmit
      WHERE dCheckIn BETWEEN DATEADD(HOUR, -${hour}, GETDATE()) AND GETDATE()
      `
      pool = await sqlConnectionPool(db[config.dev ? 'dev' : 'prd'])
      let [ [ record ] ] = (await pool.request().query(command)).recordsets
      if (parseInt(record.nTask) === 0) {
        sendLINE(lineNone(`ไม่มีข้อมูลในช่วงเวลา ${moment().add(hour * -1, 'hour').format('HH:mm')} - ${moment().format('HH:mm')}`))
        // sendLINE(`*SURVEY-POS*\nไม่มีข้อมูลในช่วงเวลา ${moment().add(hour * -1, 'hour').format('HH:mm')} - ${moment().format('HH:mm')}`)
      }
    } catch (ex) {
      console.log(ex.message)
    } finally {
      pool.close()
      res.end()
    }
  })

  app.post('/api/submit', async (req, res) => {
    let pool = { close: () => {} }
    try {
      let { key, name, username, tasks } = req.body
      let created = moment() // 2019-03-01 18:04:09.503
      let updated = []
      pool = await sqlConnectionPool(db[config.dev ? 'dev' : 'prd'])
      for (const e of tasks) {
        let nVersion = 1
        let isUpdated = false
        if (key) {
          let dCheckIn = moment(key, 'YYYYMMDDHHmmssSSS')
          created = dCheckIn
          let checkRow = `
            SELECT sStatus, sRemark, nVersion
            FROM UserTaskSubmit s
            INNER JOIN UserTaskDetail t ON t.nTaskDetailId = s.nTaskDetailId
            INNER JOIN (
              SELECT MAX(nIndex) nIndex  FROM UserTaskSubmit
              WHERE dCheckIn = CONVERT(DATETIME, '${dCheckIn.format('YYYY-MM-DD HH:mm:ss.SSS')}') AND nTaskDetailId = ${e.nTaskDetailId}
            ) i ON i.nIndex = s.nIndex
          `
          let [ [ record ] ] = (await pool.request().query(checkRow)).recordsets
          let sStatus = record['sStatus'] === (e.problem ? e.status : 'PASS')
          let sRemark = record['sRemark'] === (e.reason || '')
          if (!sStatus || !sRemark) {
            nVersion = parseInt(record['nVersion']) + 1
            isUpdated = true
          }
        }

        if (!key || isUpdated) {
          let command = `INSERT INTO [dbo].[UserTaskSubmit] ([nTaskDetailId],[sUsername],[sName],[sStatus],[sRemark],[nOrder],[dCheckIn],[dCreated],[nVersion])
            VALUES (${e.nTaskDetailId},'${username.trim()}','${name}','${e.problem ? e.status : 'PASS'}', '${(e.reason || '').replace(`'`,`\'`)}'
            , ${e.nOrder}, CONVERT(DATETIME, '${created.format('YYYY-MM-DD HH:mm:ss.SSS')}', 121),  GETDATE(), ${nVersion})
          `
          await pool.request().query(command)
          updated.push(e)
        }
      }
      
      let totalFail = tasks.filter(e => e.status === 'FAIL').length
      let totalWarn = tasks.filter(e => e.status === 'WARN').length
      let totalInfo = tasks.filter(e => e.status === 'INFO').length
    
      let topName = `Summary Monitor DailyClose`
      let topStatus = (totalFail > 0) ? 'FAIL' : totalWarn > 0 ? 'WARN' : totalInfo > 0 ? 'INFO' : 'PASS'
      let topDate = moment().format('HH:mm, DD MMM YYYY')

      let logText = `Monitor ${updated.length > 0 ? updated.length : tasks.length} (F:${totalFail} W:${totalWarn}  I:${totalInfo})`
      logger.info(logText, created.format('YYYY-MM-DD HH:mm:ss.SSS'), key ? 'Updated.' : 'Insterted.')
      if (!key) { // สรุป Monitor DailyClose 21.03.2019 Time 22.30
        sendLINE(lineMonitor(name, tasks))
        // sendLINE(`*[${topStatus}] ${topName}*\n${msg}\n\n(${name} at ${topDate})`, req.body)
      } else if (updated.length > 0) {
        sendLINE(lineMonitor(name, updated, `http://${hostName}/history/version/${key}`))
      }
      res.json({ success: true })
    } catch (ex) {
      logger.error(ex)
      res.json({ success: false })
    } finally {
      pool.close()
      res.end()
    }
  })

  app.put('/api/logs/:app/:group/:status/:msg?', async (req, res) => {
    try {
      let { app, group, status, msg } = req.params
      const appLogs = require('./debuger')(app)
      if (!appLogs[status]) return res.end()
      const { ServiceLog } = await mongodb.open()
      let { text } = req.body
      msg = msg || (!text ? JSON.stringify(req.body) : text)

      appLogs[status](`${group !== 'null' ? `[${group}]` : ''} ${msg}`)
      await new ServiceLog({ app, group: (group !== 'null' ? group : ''), status, message: msg, created: new Date() }).save()
    } catch {
      res.statusCode(404)
    } finally {
      res.end()
    }
  })

  if (!config.dev) {
    await nuxt.ready()
    app.use(nuxt.render)
  }
  // Listen the server
  await app.listen(port, host)
  logger.start(`Listening on http://${host}:${port}`)
}

start().catch(ex => {
  logger.error(ex)
  process.exit(1)
})
