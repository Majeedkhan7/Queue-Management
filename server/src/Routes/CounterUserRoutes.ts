import express  from 'express'

const router = express.Router()
const CounterUserController = require('../Controllers/CounterUserController')
const auth = require('../jwt/index')


router.post('/counterUser/Create',CounterUserController.CreateUser)
router.post('/counterUser/login',CounterUserController.LoginUser)
router.get('/counterUser/ViewIssues',auth.authenticateToken,CounterUserController.ViewIssues)
router.put('/counterUser/CallToken',auth.authenticateToken,CounterUserController.CallToken)
router.post('/counterUser/Recall',auth.authenticateToken,CounterUserController.ReCall)
router.get('/counterUser/ViewIssue/:id',auth.authenticateToken,CounterUserController.ViewSingleIssue)
router.put('/counterUser/Issue/done/:id',auth.authenticateToken,CounterUserController.DoneIssue)
router.put('/counterUser/Issue/done/Callnext/:id',auth.authenticateToken,CounterUserController.DoneAndCallIssue)
router.put('/counterUser/logout',auth.authenticateToken,CounterUserController.LogOutCouter)
module.exports = router