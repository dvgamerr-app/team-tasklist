const debuger = require('@touno-io/debuger')
const mongo = require('../../mongodb')
const { bearer } = require('../encrypt')

const getAccountUser = user => {
  if (!user) throw new Error('Basic Authenticate fail.')

  let { username, fullname, email, level, lasted } = user
  return { username, fullname, email, level, lasted }
}

module.exports = async (req, res) => {
  let result = {}
  const logger = await debuger('AUTH')
  try {
    let raw = req.headers['authorization']
    if (!raw) return res.json({})
    await mongo.open()
    let { Account } = mongo.get()
    if (/^bearer /ig.test(raw)) {
      raw = raw.replace(/^bearer /ig, '')
      if (!raw || raw === 'undefined') return res.json({})
      let decode = bearer.decode(raw)
      let account = await Account.findById(decode.raw)
      result = getAccountUser(account)
      await Account.updateOne({ _id: decode.raw }, { lasted: new Date() })
    // } else if (/^basic /ig.test(raw)) {
    //   const { usr, pwd } = basic.decode(raw)
    //   if (!usr) return res.json({})

    //   const account = await Account.findOne({ username: usr.trim().toLowerCase(), pwd: md5(pwd), enabled: true })
    //   result = getAccountUser(account)
      
    //   await Account.updateOne({ _id: account._id }, { lasted: new Date() })
    }  
  } catch (ex) {
    logger.warning(ex.message || ex)
    res.status(401)
  } finally {
    res.json({ user: result })
    return res.end()
  }
}
