const express = require('express');

const coinController = require('../controllers/coin-controller');
const checkAuth = require('../middleware/check-auth');
const {check} = require("express-validator");
const router = express.Router();




router.get('/getcoins/:uid',coinController.getCoinsByUserId);

router.use(checkAuth); // Everything after this route is protected and only logged in users can access it

router.post('/addcoin',[check('name').not().isEmpty(), check('coinId').not().isEmpty(),
 check('image').not().isEmpty()] , coinController.coinAddFavorite);



module.exports = router;