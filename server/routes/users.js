var userController = require('../controllers/users.js');
const express = require("express");
const verifyToken = require('../auth/auth.js').verifyToken
const router = express.Router();

router.get('/verifyToken', verifyToken)

router.post('/login', userController.login)

router.use(verifyToken)
router.post("/register", userController.registerUser)
router.post('/changePassword', userController.changePassword)
router.get('/followup', userController.getAllUsersToFollowUp)
router.get('/search', userController.searchForUsers)
router.get('/chartData', userController.getTotalUsersToFollowupPerMonthInCurrentyear)
router.get('/', userController.getAllUsers)
router.get('/currentUser', userController.getCurrentUser)
router.route('/:id')
	.get(userController.findUserById)
	.put(userController.UpdateUser)
	.delete(userController.deleteUserById)

module.exports = router;