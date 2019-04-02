const logger = require('@debuger')('SERVER')
const lineMonitor = require('@line-flex-monitor')
const mssql = require('@mssql')
const moment = require('moment')

module.exports = async (req, res) => {
  let pool = { close: () => {} }
  try {
    let { key, name, username, tasks } = req.body
    let created = moment() // 2019-03-01 18:04:09.503
    let updated = []
    pool = await mssql()
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
}
