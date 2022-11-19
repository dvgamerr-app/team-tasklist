// const bodyParser = require('body-parser')
// const { Router } = require('express')
// const router = Router()

// router.use(bodyParser.json())
// router.get('/', require('./router/callback'))
// router.post('/', require('./router/callback'))
// router.get('/user', require('./router/user'))
// router.post('/login', require('./router/login'))
// router.post('/logout', (req, res) => res.json({ ok: true }).end())

// // Export the server middleware
// module.exports = router

// const bcrypt = require('bcrypt')
// const { project } = require('@touno-io/db/schema')
// const config = require('../../nuxt.config')

// const basicValidate = async (request, username, hash) => {
//   await project.open()
//   const { Account } = project.get()
//   const credentials = await Account.findOne({ $or: [ { username }, { email: username } ], enabled: true })
//   if (!credentials) return { isValid: false, credentials: {} }

//   const isValid = await bcrypt.compare(Buffer.from(credentials.pwd, 'base64').toString('utf-8'), hash)

//   delete credentials.pwd
//   delete credentials.enabled
//   delete credentials.line
//   delete credentials.facebook
//   return { isValid, credentials }
// }

// const jwtValidate = async (decoded) => {
//   await project.open()
//   const { Account } = project.get()
//   const user = await Account.findOne({ _id: decoded.user.id })

//   delete user.pwd
//   delete user.enabled
//   delete user.line
//   delete user.facebook

//   return { isValid: true, credentials: user }
// }

// module.exports = async (server) => {
//   await server.register(require('@hapi/basic'))
//   await server.register(require('hapi-auth-jwt2'))

//   server.auth.strategy('basic', 'basic', {
//     validate: basicValidate
//   })
//   server.auth.strategy('jwt', 'jwt', {
//     key: Buffer.from(config.jwt).toString('base64'),
//     validate: jwtValidate
//   })
//   server.auth.default('jwt')
// }
