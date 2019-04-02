const logger = require('@debuger')('SERVER')
const mssql = require('@mssql')

module.exports = async (req, res) => {
  let pool = { close: () => {} }
  try {
    pool = await mssql()
    let sql = 'SELECT nTaskDetailId, sSubject, ISNULL(sDetail,\'\') sDetail, sDescription, sSolve, nOrder FROM SURVEY_CMG..UserTaskDetail WHERE bEnabled = 1 ORDER BY nOrder ASC'
    let [ records ] = (await pool.request().query(sql)).recordsets
    res.json(records)
  } catch (ex) {
    logger.error(ex)
  } finally {
    pool.close()
    res.end()
  }
}
