// const debuger = require('@touno-io/debuger')
// const simpleOauth = require('simple-oauth2')
// const request = require('request-promise')

// // oauth2/v2.1/authorize?response_type=code&client_id=&redirect_uri=&state=12345abcde&scope=&nonce=09876xyz
// const redirectUri = 'http://localhost:3001/auth/'
// const credentials = {
//   client: { id: '1570860647' },
//   auth: {
//     tokenHost: `https://access.line.me/`,
//     tokenPath: '/oauth2/v2.1/token',
//     authorizePath: `/oauth2/v2.1/authorize`
//   }
// }

// module.exports = async (req, res) => {
//   const logger = await debuger('AUTH')
//   try {
//     const stateLine = `line`
//     const { code, state } = req.query
//     if (state === stateLine)  {
//       if (!code) {
//         const oauth2 = simpleOauth.create(credentials)
//         const authorizationUri = oauth2.authorizationCode.authorizeURL({
//           redirect_uri: redirectUri,
//           scope: 'openid email profile',
//           state: stateLine
//         })
//         res.redirect(authorizationUri)
//       } else {
//         credentials.client.secret = '040b38e6674a45f6db9b7b013f87b5eb'
//         credentials.auth.authorizePath = `https://api.line.me/`
//         const result = await request({
//           method: 'POST',
//           url: 'https://api.line.me/oauth2/v2.1/token/',
//           headers: {
//             'Content-Type': 'application/x-www-form-urlencoded'
//           },
//           form: {
//             grant_type: 'authorization_code',
//             code,
//             client_id: credentials.client.id,
//             client_secret: credentials.client.secret,
//             state,
//             redirect_uri: redirectUri
//           }
//         })
//         const data = JSON.parse(result)
//         console.log(data)
//         // const oauth2 = simpleOauth.create(credentials)
//         // const result = await oauth2.authorizationCode.getToken({
//         //   grant_type: 'authorization_code',
//         //   code: code,
//         //   client_id: credentials.client.id,
//         //   client_secret: credentials.client.secret,
//         //   state: state,
//         //   redirect_uri: redirectUri
//         // })
//       }

//     }
//   } catch (ex) {
//     console.log(ex)
//     logger.warning(ex.message || ex)
//     res.status(401)
//   } finally {
//     res.end()
//   }
// }
