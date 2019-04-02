const logger = require('@debuger')('SERVER')
const mssql = require('@mssql')
const moment = require('moment')

module.exports = async (req, res) => {
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
    pool = await mssql()
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
}
