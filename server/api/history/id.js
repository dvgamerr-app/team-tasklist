const logger = require('@debuger')('SERVER')
const mssql = require('@mssql')
const moment = require('moment')

module.exports = async (req, res) => {
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
