const express = require('express')
const consola = require('consola')
const sql = require('mssql')
const moment = require('moment')
const bodyParser = require('body-parser')
const request = require('request-promise')
const { Nuxt } = require('nuxt')
const app = express()

const auth = require('./authication')

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
const db = require('./db')
config.dev = !(process.env.NODE_ENV === 'production')

  
const sqlConnectionPool = () => new Promise((resolve, reject) => {
  const conn = new sql.ConnectionPool(db[config.dev ? 'dev' : 'prd'])
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

  const pool = await sqlConnectionPool()
  app.get('/api/list', async (req, res) => {
    try {
      let sql = 'SELECT nTaskId, sSubject, sDetail, sDescription, sSolve FROM SURVEY_CMG..UserTask WHERE bEnabled = 1 ORDER BY nOrder ASC'
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
        SELECT ROW_NUMBER() OVER (ORDER BY dCheckIn DESC) AS nRow
          , CONVERT(VARCHAR, dCheckIn,112) + CONVERT(VARCHAR, dCheckIn,12) sKey
          , sUsername, sName, CONVERT(VARCHAR, dCheckIn, 120) dCheckIn
          , SUM(CASE WHEN sStatus = 'FAIL' THEN 1 ELSE 0 END) nFail
          , SUM(CASE WHEN sStatus = 'PASS' THEN 1 ELSE 0 END) nSuccess
        FROM SURVEY_CMG..UserTaskSubmit 
        GROUP BY sUsername, sName, dCheckIn
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


  app.post('/api/submit', async (req, res) => {
    try {
      let { name, username, tasks } = req.body
      let created = moment() // 2019-03-01 18:04:09.503
      for (const e of tasks) {
        let command = `INSERT INTO [dbo].[UserTaskSubmit] ([nTaskId],[sUsername],[sName],[sStatus],[sRemark],[dCheckIn],[dCreated])
          VALUES (${e.nTaskId},'${username.trim()}','${name}','${e.problem ? 'FAIL' : 'PASS'}', '${(e.reason || '').replace(`'`,`\'`)}'
          , CONVERT(DATETIME, '${created.format('YYYY-MM-DD HH:mm:ss')}', 121),  GETDATE())
        `
        await pool.request().query(command)
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
