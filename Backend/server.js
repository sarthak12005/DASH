require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const path = require('path');
const authRoutes = require('./routes/authRoute');
const songRoutes = require('./routes/songRoute');
const dailyTaskRoutes = require('./routes/dailyTaskRoutes');
const diaryRoutes = require('./routes/diaryRoutes');
const upSongRoutes = require('./routes/upSongRoute');
const songUploadRoutes = require('./routes/songUploadRoute');
const socketHandler = require('./utils/socketHandler');
const chatRoutes = require('./routes/chatRoute');
const http = require('http');

// Initializing the socket.io server
const PORT = process.env.PORT || 9000;

const app = express();
const server = http.createServer(app);

const io  = socketHandler(server);



app.use(express.json())
app.use(cors({
    origin: [`http://localhost:5173`, `https://dash-ipry.vercel.app`],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/daily-tasks', dailyTaskRoutes);
app.use('/api/diary', diaryRoutes);
app.use('/api/Up-Song', upSongRoutes);
app.use('/api', songUploadRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
    res.send("Welcome to the DASH backend");
});


server.listen(PORT, () => {
    console.log("server is running on http://localhost:9000");
})