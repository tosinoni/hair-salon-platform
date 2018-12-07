var userController = require('../controllers/users.js');
const express = require("express");
const verifyToken = require('../auth/auth.js').verifyToken
const router = express.Router();


router.post("/register", userController.registerUser)
router.post('/login', userController.login)

router.use(verifyToken)
router.get('/', userController.getAllUser)
router.route('/:id')
	.get(userController.findUserById)
	.put(userController.UpdateUser)
	.delete(userController.deleteUserById)

module.exports = router;