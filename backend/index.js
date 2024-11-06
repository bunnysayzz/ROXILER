require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dbConnect = require('./db/dbConfig');
const transactionRouter = require('./routes/transactions.routes');

const app = express();
dbConnect();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/api', transactionRouter);
const PORT = process.env.PORT || 3001;

app.listen(PORT,() => {
    console.log('Server started at', PORT);
})