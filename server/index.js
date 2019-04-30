const express = require('express')
const md5 = require('md5')
const nodemailer = require('nodemailer')
const bodyParser = require('body-parser')
const { Nuxt } = require('nuxt')
const app = express()

const logger = require('@debuger')('SERVER')
const mongo = require('@mongo')
const { bearer } = require('./authication/encrypt')
// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3001

if (config.dev) {
  // Build only in dev mode
  app.use((req, res, next) => {
    const methodAllow = [ 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT' ]
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Methods', methodAllow.join(','))
    if (req.method === 'OPTIONS') return res.sendStatus(200)
    next()
  })
}

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const auth = require('./authication')
app.use('/auth', auth())

const apiMiddlewere = async (req, res, next) => {
  let raw = req.headers['authorization']
  try {
    if (!raw || !/^bearer /ig.test(raw)) return res.status(401).end()
    let { UserAccount } = await mongo.open()
    let decode = bearer.decode(raw)
    let account = await UserAccount.findById(decode.raw)
    if (!account || !account.enabled) return res.status(401).end()
    req.auth = account
    next()
  } catch (ex) {
    logger.warning(ex.message)
    return res.status(401).end()
  }
}
app.use('/api', apiMiddlewere, require('./api'))

const NuxtBuilder = async () => {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)
  const { UserAccount } = await mongo.open()
  if (!(await UserAccount.findOne({ username: 'dvgamerr' }))) {
    await new UserAccount({
      username: 'dvgamerr',
      fullname: 'Kananek Thongkam',
      email: 'info.dvgamer@gmail.com',
      level: '3',
      pwd: md5('dvg7po8ai'),
      enabled: true,
      lasted: new Date(),
      updated: new Date(),
      created: new Date(),
    }).save()
  }
  if (!config.dev) {
    await nuxt.ready()
    app.use(nuxt.render)
  }

  // Listen the server
  await app.listen(port, host)
  logger.start(`Listening on http://${host}:${port}`)
}

NuxtBuilder().catch(ex => {
  logger.error(ex)
  process.exit(1)
})
