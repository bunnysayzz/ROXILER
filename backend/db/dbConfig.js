require('dotenv').config();
const mongoose = require('mongoose');

const dbConnect = async () => {
    const MongoDb_URI = process.env.MONGODB_URI;
    mongoose.connect(MongoDb_URI)
        .then(() => console.log("Database Connected"))
        .catch(() => console.error("Database connection failed"));
}

module.exports = dbConnect;