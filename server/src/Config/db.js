const Mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await Mongoose.connect('mongodb+srv://levanquy1923:Quyden123z@cluster0.nynvo9n.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Cluster0', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
    }
};

module.exports = connectDB;
