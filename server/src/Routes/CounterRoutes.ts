import expres from 'express'
const counterController = require('../Controllers/CounterController')
const router = expres.Router()

router.post('/counter/create',counterController.CreateCounter)

module.exports = router