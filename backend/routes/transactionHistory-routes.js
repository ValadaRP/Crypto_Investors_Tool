const express = require('express');

const transactionsHistory = require('../controllers/transactionsHistory-controller');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();




router.use(checkAuth); // Everything after this route is protected and only logged in users can access it
router.post('/',transactionsHistory.getTransactions);




module.exports = router;