const express = require('express');
const app = express();
const route = require('./routes');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./Config/db');
const path = require('path');
const bodyParser = require('body-parser');

require('dotenv').config();

const port = 5001;

const http = require('http');
const { Server } = require('socket.io');
const { askQuestion } = require('./utils/chatbot');
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.REACT_APP_URL,
        methods: ['GET', 'POST'],
        allowedHeaders: ['my-custom-header'],
        credentials: true,
    },
});

// Serve static files from React
app.use(express.static(path.join(__dirname, '../../client/build')));

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cookieParser());
app.use(cors({ origin: process.env.REACT_APP_URL, credentials: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '')));

route(app);
connectDB();

app.post('/chat', async (req, res) => {
    const { question } = req.body;
    const data = await askQuestion(question);
    return res.status(200).json(data);
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
});

server.listen(port, () => {
    // Sử dụng server.listen thay vì app.listen
    console.log(`Example app listening on port ${port}`);
});
