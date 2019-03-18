const ldapAuth = require('./ldap')
const db = require('../mongodb')
const bodyParser = require('body-parser')
const jsonwebtoken = require('jsonwebtoken')
const logger = require('../debuger')('AUTH')
const md5 = require('md5')

const { Router } = require('express')
const router = Router()

router.use(bodyParser.json())

router.use((req, res, next) => {
  const methodAllow = [ 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT' ]
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Methods', methodAllow.join(','))
  if (req.method === 'OPTIONS') return res.sendStatus(200)
  next()
})
// Import API Routes
const userData = [
  'name',
  'mail',
  'title',
  'company',
  'permission',
  'department',
  'office_name',
  'description',
  'display_name',
  'telephone_no',
  'user_name',
  'user_type',
  'user_level',
  'lasted',
  'created'
]
router.get('/user', (req, res) => (async () => {
  let raw = req.headers['authorization']
  if (!raw) return res.json({})

  try {
    let { User } = await db.open()
    raw = raw.replace(/^bearer /ig, '')
    if (raw === 'undefined') throw new Error('user data not found.')

    let decode = decodeToken(raw)
    let data = await User.findById(decode._id, userData.join(' '))
    if (!data) throw new Error('user data not found.')
    res.json({ user: data })
  } catch (ex) {
    res.json({})
  }
})().catch((ex) => {
  logger.warning(ex)
  res.json({})
}))

const encodeToken = data => {
  const hashId = md5(data.mail + (+(new Date())))
  return jsonwebtoken.sign({ hash: hashId, ...data }, process.env.JWT_KEYHASH)
} 

const decodeToken = data => {
  return jsonwebtoken.verify(data, process.env.JWT_KEYHASH)
}

router.post('/recheck', (req, res) => (async () => {
  let { user } = req.body

  logger.log(`re-checking ${user ? `(${user})` : ''}`)
  let { User } = await db.open()
  try {
    if (!user) throw new Error('Unauthorized 402')
    user = user.trim().toLowerCase()

    let acc = await User.findOne({ mail: user })
    if (!acc) throw new Error('Unauthorized 403')
    res.json({ enabled: acc.enabled, activate: acc.activate })
  } catch (ex) {
    res.json({ error: ex.message || ex })
  }
})().catch(ex => {
  logger.warning(ex)
  res.json({ error: ex.message || ex })
}))


router.post('/login', (req, res) => (async () => {
  let date = new Date()
  
  let auth = {}
  let { user, pass } = req.body
  let raw = req.headers['authorization']
  
  logger.log('LDAP: auth:', !!raw)
  logger.log('LDAP: user:', user)
  if (raw && !user) {
    let IsEncode = false
    try {
      auth = new Buffer.from(raw.replace(/^basic /ig, ''), 'base64').toString('utf8')
      if (auth) {
        auth = /(?<usr>.*?):(?<pwd>.*)/ig.exec(auth).groups || {}
        IsEncode = true
      }
    } finally { /* decode but user random charector and send to server. */}

    if (!IsEncode) {
      logger.log(`Login -- Unauthorized (401)`)
      return res.status(401).json({ error: 'Unauthorized (401)'})
    }
  } else {
    auth = { usr: user, pwd: pass }
  }
  if (!auth.usr) {
    logger.log(`Login -- Unauthorized (404)`)
    return res.status(401).json({ error: 'Unauthorized (404)'})
  }

  let { User, UserHistory } = await db.open()
  try {
    if (!auth) throw new Error('Unauthorized (402)')
    auth.usr = auth.usr.trim().toLowerCase()

    let fullMail = !/@/g.test(auth.usr.toLowerCase()) ? `${auth.usr.toLowerCase()}@central.co.th` : auth.usr.toLowerCase()
    let user = await User.findOne({ $or: [ { mail: fullMail }, { user_name: auth.usr.toLowerCase() } ] })
    let data = null
    try {
      // logger.log('LDAP:', auth)
      data = await ldapAuth(auth.usr, auth.pwd)
      if (!data || !data.user_name) data = await ldapAuth(fullMail, auth.pwd)
      // logger.log('USER:', data.user_name)
      // logger.log('MAIL:', data.mail)
      if (data.mail) data.mail = data.mail.trim().toLowerCase()
      if (data.user_name) data.user_name = data.user_name.trim().toLowerCase()
    } catch (ex) {
      // logger.log('LDAP:', ex.message)
      data = { error: ex.message || ex }
      user = await User.findOne({ $or: [ { mail: fullMail }, { user_name: auth.usr.toLowerCase() } ], pwd: md5(auth.pwd) })
    }
    if (!user && data.error) throw new Error(data.error)
    if (!data || !data.user_name) throw new Error('LDAP auth unsuccessful.')
    if (!user) {
      user = await new User(Object.assign({
        pwd: md5(auth.pwd),
        user_level: 0,
        token: null,
        activate: false,
        enabled: false,
        lasted: date,
        updated: date,
        created: date
      }, data)).save()
    } else {
      await User.updateOne({ _id: user._id }, {
        $set: { pwd: md5(auth.pwd), token: null, lasted: date }
      })
    }
 
    let accessToken = encodeToken({ _id: user._id })
    await User.updateOne({ _id: user._id }, { $set: { token: accessToken } })
    // if (user.activate && user.enabled) {
    logger.log(`Login (success) -- ${auth.usr}`)
    await new UserHistory({ mail: auth.usr, error: data.err, token: accessToken, created: date }).save()
    res.json({ token: accessToken })
    // } else {
    //   logger.log(`Login (suspended) -- ${auth.usr}`)
    //   await new UserHistory({ mail: auth.usr, error: 'account suspended or inactivate', token: accessToken, created: date }).save()
    //   res.status(401).json({ error: 'Unauthorized (403)' })
    // }
  } catch (ex) {
    logger.log(`Login (fail) -- ${(ex.message || ex)}`)
    await new UserHistory({ mail: auth.usr, error: (ex.message || ex), token: null, created: date }).save()
    res.json({ error: ex.message || ex })
  }
})().catch(ex => {
  logger.warning(ex)
  res.status(401).json({ error: ex.message || ex })
}))

router.post('/logout', (req, res) => (async () => {
  res.json({})
})().catch((ex) => {
  logger.warning(ex)
  res.status(401).json({})
}))

if (process.env.NODE_ENV === 'production') {
  logger.start(`Authentication listening on ${process.env.AXIOS_BASE_URL}`)
}
// Export the server middleware
module.exports = {
  path: '/auth',
  handler: router
}
