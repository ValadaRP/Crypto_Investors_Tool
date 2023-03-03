const express = require('express');

const transactionController = require('../controllers/transaction-controller');
const checkAuth = require('../middleware/check-auth');
const {check} = require("express-validator");
const router = express.Router();


router.get('/getTransactions/:uid',transactionController.transactionGetAll);

router.use(checkAuth); // Everything after this route is protected and only logged in users can access it

router.post('/buy',[check('coinId').not().isEmpty(),check('name').not().isEmpty(),
    check('image').not().isEmpty(),check('quantity').not().isEmpty(), check('price').not().isEmpty()],transactionController.transactionBuy);
router.post('/sell',[check('transactionId').not().isEmpty()],transactionController.transactionSell);




module.exports = router;