const logger = require('@debuger')('SERVER')
const mssql = require('@mssql')
const moment = require('moment')

module.exports = async (req, res) => {
  let key = parseInt(req.params.id)
  if (isNaN(key)) return res.json({})
  let pool = { close: () => {} }
  logger.info('History ID:', req.params.id, 'Deleted.')
  let dCheckIn = moment(req.params.id, 'YYYYMMDDHHmmssSSS')
  if (!moment.isMoment(dCheckIn)) return res.json({})
  try {
    let sql = `DELETE FROM UserTaskSubmit WHERE dCheckIn = CONVERT(DATETIME, '${dCheckIn.format('YYYY-MM-DD HH:mm:ss.SSS')}')`
    pool = await mssql()
    await pool.request().query(sql)
    return res.json({})
  } catch (ex) {
    logger.error(ex)
  } finally {
    pool.close()
    res.end()
  }
}
