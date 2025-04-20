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


const PORT = process.env.PORT || 9000;

const app = express();

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

app.get('/', (req, res) => {
    res.send("Welcome to the DASH backend");
});


app.listen(PORT, () => {
    console.log("server is running on http://localhost:9000");
})