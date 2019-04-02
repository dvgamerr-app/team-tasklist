const logger = require('@debuger')('SERVER')
const lineNone = require('@line-flex-none')

const moment = require('moment')

module.exports = async (req, res) => {
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
    }
  } catch (ex) {
    logger.error(ex)
  } finally {
    pool.close()
    res.end()
  }
}
