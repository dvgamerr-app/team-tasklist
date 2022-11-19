// // const { basic, bearer } = require('../encrypt')
// // const debuger = require('@touno-io/debuger')
// // const { project } = require('@touno-io/db/schema')
// // const md5 = require('md5')
// const JWT = require('jsonwebtoken')
// const aguid = require('aguid')

// // module.exports = async (req, res) => {
// //   let raw = req.headers['authorization']
// //   let { username, password } = req.body
// //   const logger = await debuger('AUTH')
// //   try {
// //     let auth = { username, password }
// //     if (/^basic /ig.test(raw)) {
// //       let { usr, pwd } = basic.decode(raw)
// //       auth = { username: usr, password: md5(pwd) }
// //       if (!auth.username) return res.status(401).json({})
// //     }
// //     let { Account } = touno.get()
// //     auth.username = auth.username.trim().toLowerCase()
// //     const account = await Account.findOne({ username: auth.username, pwd: auth.password, enabled: true })
// //     if (!account) throw new Error('auth unsuccessful.')

// //     res.json({ token: bearer.encode(account._id) })
// //   } catch (ex) {
// //     logger.warning(ex)
// //     res.status(401).json({ error: ex.message || ex })
// //   } finally {
// //     res.end()
// //   }
// // }
// const config = require('../../../nuxt.config')
// const timeoutMinutes = 30

// module.exports = async (request) => {
//   const { expired } = request.payload
//   const { isAuthenticated, credentials } = request.auth
//   if (isAuthenticated) {
//     const session = {
//       id: aguid(),
//       exp: expired ? new Date().getTime() + timeoutMinutes * 60 * 1000 : null,
//       user: { id: credentials.id }
//     }

//     const token = JWT.sign(session, Buffer.from(config.jwt).toString('base64'))
//     console.log('expired', expired)
//     console.log('auth', request.auth)
//     console.log('session', session)
//     console.log('token', token)

//     return { token }
//   } else {
//     return { token: null }
//   }
// }
