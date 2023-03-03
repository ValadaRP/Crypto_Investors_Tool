const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const usersRoutes = require('./routes/users-routes');
const coinRoutes = require('./routes/coin-routes');
const transactionRoutes = require('./routes/transactions-routes');
const transactionHistoryRoutes = require('./routes/transactionHistory-routes');
const HttpError = require('./models/http-error');
const cors = require('cors');

app.use(bodyParser.json());

app.use(cors());

app.use('/api/users', usersRoutes);
app.use('/api/coin', coinRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/transactionHistory', transactionHistoryRoutes);

app.use((req,res,next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
});

app.use((error,req,res,next) => {
    if (res.headerSent){
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message || 'An unknown error occurred!'});
});

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:
${process.env.DB_PASS}@cluster0.0x0li.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`).then(() => {
    app.listen(5000);
    console.log("server is up on port 5000")
}).catch(err => {console.log(err)});

