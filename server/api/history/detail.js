const logger = require('@debuger')('SERVER')
const mssql = require('@mssql')

module.exports = async (req, res) => {
  let { id } = req.params
  let pool = { close: () => {} }
  try {
    pool = await mssql()
    let sql = `select sTitleName, sMenu FROM UserTask WHERE nTaskId = ${id}`
    let [ task ] = (await pool.request().query(sql)).recordset
    
    sql = `SELECT nTaskDetailId, sSubject, ISNULL(sDetail,'') sDetail, sDescription, sSolve, nOrder
      FROM UserTaskDetail d
      INNER JOIN UserTask t ON t.nTaskId = d.nTaskId
      WHERE d.bEnabled = 1 AND t.nTaskId = ${id} ORDER BY nOrder ASC`
    let [ records ] = (await pool.request().query(sql)).recordsets
    res.json({ title: task['sTitleName'], tasks: records })
  } catch (ex) {
    logger.error(ex)
  } finally {
    pool.close()
    res.end()
  }
}
