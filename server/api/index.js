const { Router } = require('express')
const router = Router()

router.post('/todo', require('./todo/new'))
router.get('/todo/:id', require('./todo/id'))
router.get('/todo/list/:status', require('./todo/list'))
router.use('/todo/search', require('./todo/search'))
// router.get('/history', require('./history'))
// router.get('/history/:id', require('./history/id'))
// router.post('/history/del/:id', require('./history/delete'))
// router.get('/history/version/:id', require('./history/version'))

// router.post('/history/submit', require('./history/submit'))

// router.get('/monitor/check-hour/:hour', require('./monitor/check-hour'))
// router.put('/logs/:app/:group/:status/:msg?', require('./logs/append'))

module.exports = router
