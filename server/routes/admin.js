var adminController = require('../controllers/admin/admin.js');
const express = require("express");
const verifyToken = require('../auth/auth.js').verifyToken
const router = express.Router();

router.get('/verifyToken', verifyToken)


router.use(verifyToken)
router.post("/", adminController.createAdmin)
router.get('/', adminController.getAllAdmins)
router.route('/:id')
    .put(adminController.updateAdmin)
    .delete(adminController.deleteAdminById)

module.exports = router;