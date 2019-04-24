const { basic, bearer } = require('../encrypt')
const mongo = require('@mongo')
const logger = require('@debuger')('AUTH')
const md5 = require('md5')

module.exports = async (req, res) => {
  let raw = req.headers['authorization']
  let { username, password } = req.body

  try {
    let auth = { username, password }
    if (/^basic /ig.test(raw)) {
      let { usr, pwd } = basic.decode(raw)
      auth = { username: usr, password: md5(pwd) }
      if (!auth.username) return res.status(401).json({})
    }
    let { UserAccount } = await mongo.open()
    auth.username = auth.username.trim().toLowerCase()
    const account = await UserAccount.findOne({ username: auth.username, pwd: auth.password, enabled: true })
    if (!account) throw new Error('auth unsuccessful.')

    res.json({ token: bearer.encode(account._id) })
  } catch (ex) {
    logger.warning(ex)
    res.status(401).json({ error: ex.message || ex })
  } finally {
    return res.end()
  }
}
