import express from 'express'
const NormalUserController = require('../Controllers/NormalUserController')
const router = express.Router()
const auth = require('../jwt/index')

router.post('/normaluser/create/account',NormalUserController.RegisterNormalUser)
router.post('/normaluser/login',NormalUserController.LoginNormalUser)
router.post('/normaluser/addissue',auth.authenticateToken,NormalUserController.AddIssues)
router.delete('/normaluser/issue/cancel/:id',auth.authenticateToken,NormalUserController.CancelIssue)
router.get('/normaluser/view/notifications',auth.authenticateToken,NormalUserController.ViewNotification)
router.get('/normaluser/view/solution',auth.authenticateToken,NormalUserController.ViewSolution)
router.get('/normaluser/IssueCheck',auth.authenticateToken,NormalUserController.IssueCheck)
router.get('/normaluser/details',auth.authenticateToken,NormalUserController.CounterDetails)
module.exports = router