// // const { Router } = require('express')
// // const router = Router()

// // router.post('/todo', require('./todo/new'))
// // router.get('/todo/:id', require('./todo/id'))
// // router.get('/todo/list/:status', require('./todo/list'))
// // router.use('/todo/search', require('./todo/search'))
// // // router.get('/history', require('./history'))
// // // router.get('/history/:id', require('./history/id'))
// // // router.post('/history/del/:id', require('./history/delete'))
// // // router.get('/history/version/:id', require('./history/version'))

// // // router.post('/history/submit', require('./history/submit'))

// // // router.get('/monitor/check-hour/:hour', require('./monitor/check-hour'))
// // // router.put('/logs/:app/:group/:status/:msg?', require('./logs/append'))

// // if (config.dev) {
// //   // Build only in dev mode
// //   app.use((req, res, next) => {
// //     const methodAllow = [ 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT' ]
// //     res.setHeader('Access-Control-Allow-Origin', '*')
// //     res.setHeader('Access-Control-Allow-Headers', '*')
// //     res.setHeader('Access-Control-Allow-Credentials', 'true')
// //     res.setHeader('Access-Control-Allow-Methods', methodAllow.join(','))
// //     if (req.method === 'OPTIONS') return res.sendStatus(200)
// //     next()
// //   })
// // }

// // app.use(bodyParser.urlencoded({ extended: false }))
// // app.use(bodyParser.json())

// // app.use('/auth', require('./authication'))

// // app.use('/api', apiMiddlewere, require('./api'))

// export default [
//   { method: 'POST', path: '/auth/login', options: { auth: { strategy: 'basic', mode: 'try' } }, handler: require('./authication/router/login') },
//   { method: 'GET', path: '/auth/user', options: { auth: 'jwt' }, handler: require('./authication/router/user') }
// ]
export default [
  {
    method: 'GET',
    path: '/health',
    handler: (_, res) => {
      return res.send('OK')
    },
  },
]
