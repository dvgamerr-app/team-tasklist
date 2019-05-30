const { basic, bearer } = require('../encrypt')
const debuger = require('@touno-io/debuger')
const mongo = require('../../mongodb')
const md5 = require('md5')

module.exports = async (req, res) => {
  let raw = req.headers['authorization']
  let { username, password } = req.body
  const logger = await debuger('AUTH')
  try {
    let auth = { username, password }
    if (/^basic /ig.test(raw)) {
      let { usr, pwd } = basic.decode(raw)
      auth = { username: usr, password: md5(pwd) }
      if (!auth.username) return res.status(401).json({})
    }
    await mongo.open()
    let { Account } = mongo.get()
    auth.username = auth.username.trim().toLowerCase()
    const account = await Account.findOne({ username: auth.username, pwd: auth.password, enabled: true })
    if (!account) throw new Error('auth unsuccessful.')

    res.json({ token: bearer.encode(account._id) })
  } catch (ex) {
    logger.warning(ex)
    res.status(401).json({ error: ex.message || ex })
  } finally {
    return res.end()
  }
}
