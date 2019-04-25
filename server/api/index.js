const { Router } = require('express')
const router = Router()

router.post('/task-list', require('./task-list/task-new'))
// router.get('/history', require('./history'))
// router.get('/history/:id', require('./history/id'))
// router.post('/history/del/:id', require('./history/delete'))
// router.get('/history/version/:id', require('./history/version'))

// router.post('/history/submit', require('./history/submit'))

// router.get('/monitor/check-hour/:hour', require('./monitor/check-hour'))
// router.put('/logs/:app/:group/:status/:msg?', require('./logs/append'))

module.exports = router
