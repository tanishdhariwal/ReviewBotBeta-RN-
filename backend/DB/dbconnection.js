const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const connectionToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to the database');
        return mongoose.connection; // Added return statement
    } catch (error) {
        console.log('Error connecting to the database');
        throw error; // Optional: rethrow the error
    }
}

module.exports = connectionToDB;