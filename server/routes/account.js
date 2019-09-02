var accountController = require('../controllers/account/account.js');
const express = require("express");
const verifyToken = require('../auth/auth.js').verifyToken
const router = express.Router();

router.get('/verifyToken', verifyToken)


router.use(verifyToken)
router.post("/", accountController.addEntry)
router.get('/', accountController.getAllEntries)
router.route('/:id')
    .put(accountController.updateEntry)
    .delete(accountController.deleteEntryById)

module.exports = router;