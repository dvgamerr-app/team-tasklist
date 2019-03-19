const express = require('express')
const consola = require('consola')
const sql = require('mssql')
const moment = require('moment')
const bodyParser = require('body-parser')
const { Nuxt } = require('nuxt')
const app = express()

const auth = require('./authication')

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
const db = require('./db')
config.dev = !(process.env.NODE_ENV === 'production')

const sendLINE = async (msg) => {
  const noti = await sqlConnectionPool(db['noti'])
  await noti.request().query(`exec dbo.PushMessage 'Ca2338af8e1ae465a2541acde69cd4e0c', '${msg}'`)
  noti.close()
}

const sqlConnectionPool = (db) => new Promise((resolve, reject) => {
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

  const pool = await sqlConnectionPool(db[config.dev ? 'dev' : 'prd'])
  
  app.get('/api/list', async (req, res) => {
    try {
      let sql = 'SELECT nTaskId, sSubject, sDetail, sDescription, sSolve, nOrder FROM SURVEY_CMG..UserTask WHERE bEnabled = 1 ORDER BY nOrder ASC'
      let [ records ] = (await pool.request().query(sql)).recordsets
      res.json(records)
    } catch (ex) {
      console.log(ex)
    } finally {
      res.end()
    }
  })

  app.get('/api/history', async (req, res) => {
    let page = parseInt(req.query.p || 1)
    if (page === NaN) return res.json([])
    try {
      let sql = `
      SELECT * FROM (
        SELECT ROW_NUMBER() OVER (ORDER BY g.dCreated DESC) AS nRow
          , g.sKey, sUsername, sName, g.dCreated, MAX(g.dModified) dModified
          , SUM(CASE WHEN sStatus = 'FAIL' THEN 1 ELSE 0 END) nFail
          , SUM(CASE WHEN sStatus = 'PASS' THEN 1 ELSE 0 END) nSuccess
        FROM SURVEY_CMG..UserTaskSubmit s
        INNER JOIN (
          SELECT CONVERT(VARCHAR,dCheckIn,112) + REPLACE(CONVERT(VARCHAR,dCheckIn,114), ':', '') sKey, nTaskId, MAX(nIndex) nIndex
		      , CONVERT(VARCHAR, MIN(dCreated), 120) dCreated
          , CONVERT(VARCHAR, MAX(dCreated), 120) dModified
          FROM SURVEY_CMG..UserTaskSubmit
          GROUP BY CONVERT(VARCHAR,dCheckIn,112) + REPLACE(CONVERT(VARCHAR,dCheckIn,114), ':', ''), nTaskId
        ) g ON g.nIndex = s.nIndex
        GROUP BY g.sKey, sUsername, sName, g.dCreated
      ) AS r WHERE nRow >= ${page} * 100 - 99 AND nRow <= ${page} * 100
      `
      let [ records ] = (await pool.request().query(sql)).recordsets
      return res.json(records)
    } catch (ex) {
      console.log(ex)
    } finally {
      res.end()
    }
  })

  app.get('/api/history/:id', async (req, res) => {
    let key = parseInt(req.params.id)
    if (key === NaN) return res.json({})
    if (!moment.isMoment(moment(key, 'YYYYMMDDHHmmssSSS'))) return res.json({})
    let dCheckIn = moment(key, 'YYYYMMDDHHmmssSSS').format('YYYY-MM-DD HH:mm:ss.SSS')
    try {
      let sql = `
      SELECT s.nIndex, s.nTaskId, s.sName, t.sSubject, t.sDetail, t.sSolve, t.nOrder, sStatus, sRemark, nVersion
      FROM UserTaskSubmit s
      INNER JOIN UserTask t ON t.nTaskId = s.nTaskId
      INNER JOIN (
        SELECT MAX(nIndex) nIndex  FROM UserTaskSubmit
        WHERE dCheckIn = CONVERT(DATETIME, '${dCheckIn}')
        GROUP BY nTaskId
      ) i ON i.nIndex = s.nIndex
      ORDER BY s.nOrder ASC, nVersion DESC, s.dCreated ASC
      `
      let [ records ] = (await pool.request().query(sql)).recordsets
      let editor = []
      records = records.map(e => {
        if (editor.indexOf(e['sName']) === -1) editor.push(e['sName'])
        e.selected = e['sStatus'] === 'PASS'
        e.problem = e['sStatus'] === 'FAIL'
        e.reason = e['sRemark']
        delete e['sStatus']
        delete e['sRemark']
        return e
      })
      return res.json({ editor: editor.join(', '), records: records })
    } catch (ex) {
      console.log(ex)
    } finally {
      res.end()
    }
  })

  app.get('/api/version/:id', async (req, res) => {
    let key = parseInt(req.params.id)
    if (key === NaN) return res.json({})
    if (!moment.isMoment(moment(key, 'YYYYMMDDHHmmssSSS'))) return res.json({})
    let dCheckIn = moment(key, 'YYYYMMDDHHmmssSSS').format('YYYY-MM-DD HH:mm:ss.SSS')
    try {
      let sql = `
      SELECT s.nTaskId, s.sName, t.sSubject, t.sDetail, sStatus, sRemark, nVersion, CONVERT(VARCHAR, s.dCreated, 120) dCreated
      FROM UserTaskSubmit s
      INNER JOIN UserTask t ON t.nTaskId = s.nTaskId
      WHERE dCheckIn = CONVERT(DATETIME, '${dCheckIn}')
      ORDER BY s.nOrder ASC, nVersion DESC, s.dCreated ASC
      `
      let [ records ] = (await pool.request().query(sql)).recordsets
      let editor = []
      records = records.map(e => {
        if (editor.indexOf(e['sName']) === -1) editor.push(e['sName'])
        e.selected = e['sStatus'] === 'PASS'
        e.problem = e['sStatus'] === 'FAIL'
        e.reason = e['sRemark']
        delete e['sStatus']
        delete e['sRemark']
        return e
      })
      return res.json({ editor: editor.join(', '), records: records })
    } catch (ex) {
      console.log(ex)
    } finally {
      res.end()
    }
  })

  app.post('/api/submit', async (req, res) => {
    try {
      let { key, name, username, tasks } = req.body
      let created = moment() // 2019-03-01 18:04:09.503
      let msg = ''
      let problem = 0
      let updated = 0
      for (const e of tasks) {
        let nVersion = 1
        let isUpdated = false
        if (key) {
          let dCheckIn = moment(key, 'YYYYMMDDHHmmssSSS')
          created = dCheckIn
          let checkRow = `
            SELECT sStatus, sRemark, nVersion
            FROM UserTaskSubmit s
            INNER JOIN UserTask t ON t.nTaskId = s.nTaskId
            INNER JOIN (
              SELECT MAX(nIndex) nIndex  FROM UserTaskSubmit
              WHERE dCheckIn = CONVERT(DATETIME, '${dCheckIn.format('YYYY-MM-DD HH:mm:ss.SSS')}') AND nTaskId = ${e.nTaskId}
            ) i ON i.nIndex = s.nIndex
          `
          let [ [ record ] ] = (await pool.request().query(checkRow)).recordsets
          let sStatus = record['sStatus'] === (e.problem ? 'FAIL' : 'PASS')
          let sRemark = record['sRemark'] === (e.reason || '')
          if (!sStatus || !sRemark) {
            nVersion = parseInt(record['nVersion']) + 1
            isUpdated = true
          }
        }

        if (!key || isUpdated) {
          let command = `INSERT INTO [dbo].[UserTaskSubmit] ([nTaskId],[sUsername],[sName],[sStatus],[sRemark],[nOrder],[dCheckIn],[dCreated],[nVersion])
            VALUES (${e.nTaskId},'${username.trim()}','${name}','${e.problem ? 'FAIL' : 'PASS'}', '${(e.reason || '').replace(`'`,`\'`)}'
            , ${e.nOrder}, CONVERT(DATETIME, '${created.format('YYYY-MM-DD HH:mm:ss.SSS')}', 121),  GETDATE(), ${nVersion})
          `
          await pool.request().query(command)
          updated++
          if (e.problem) {
            problem++
            let [ task ] = (await pool.request().query(`SELECT sSubject FROM [dbo].[UserTask] WHERE nTaskId = ${e.nTaskId}`)).recordset
            msg += `\n- ${task.sSubject.trim()} - \`${e.reason}\``
          }
        }
      }
      if (!key) {
        let fail = `*[FAIL]* พบข้อผิดพลาด ${problem} รายการ${msg}\n_(${name})_`
        let pass = `*[PASS]* ตรวจสอบทุกระบบแล้ว.\n_(${name})_`
        sendLINE(problem > 0 ? fail : pass)
      } else {
        if (updated > 0) sendLINE(`*[UPDATE]* ${updated} รายการ.\nhttp://${host}:${port}/history/version/${key}`)
      }

      res.json({ success: true })
    } catch (ex) {
      console.log(ex)
      res.json({ success: false })
    } finally {
      res.end()
    }
  })

  if (!config.dev) {
    await nuxt.ready()
    app.use(nuxt.render)
  }
  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start().catch(ex => {
  console.log(ex)
  process.exit(1)
})
