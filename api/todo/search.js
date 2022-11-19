// const { touno } = require('@touno-io/db/schema')
// const { Router } = require('express')
// const router = Router()

// router.get('/project/:search', async (req, res) => {
//   const { search } = req.params
//   try {
//     const { Todo } = touno.get()
//     const data = await Todo.aggregate([ { $match: { project: new RegExp(search,'ig') } }, { $group : { _id : '$project' } } ])
//     res.json(data.map(e => e._id))
//   } catch (ex) {
//     res.json({ error: ex.message || ex })
//   } finally {
//     res.end()
//   }
// })

// router.get('/assign/:search', async (req, res) => {
//   const { search } = req.params
//   try {
//     const { Account } = touno.get()
//     const data = await Account.find({ fullname: { $regex: new RegExp(search,'ig') } })
//     res.json(data.map(e => {
//       return {
//         id: e._id,
//         fullname: e.fullname
//       }
//     }))
//   } catch (ex) {
//     res.json({ error: ex.message || ex })
//   } finally {
//     res.end()
//   }
// })

// router.get('/assign', async (req, res) => {
//   // let { search } = req.params
//   try {
//     const { Todo } = touno.get()
//     const data = await Todo.aggregate([ { $group : { _id : '$project' } } ])
//     res.json(data)
//   } catch (ex) {
//     res.json({ error: ex.message || ex })
//   } finally {
//     res.end()
//   }
// })

// router.get('/tag', async (req, res) => {
//   // let { search } = req.params
//   try {
//     const { Todo } = touno.get()
//     const data = await Todo.aggregate([ { $group : { _id : '$project' } } ])
//     res.json(data)
//   } catch (ex) {
//     res.json({ error: ex.message || ex })
//   } finally {
//     res.end()
//   }
// })
// // router.get('/history', require('./history'))
// // router.get('/history/:id', require('./history/id'))
// // router.post('/history/del/:id', require('./history/delete'))
// // router.get('/history/version/:id', require('./history/version'))

// // router.post('/history/submit', require('./history/submit'))

// // router.get('/monitor/check-hour/:hour', require('./monitor/check-hour'))
// // router.put('/logs/:app/:group/:status/:msg?', require('./logs/append'))

// module.exports = router
