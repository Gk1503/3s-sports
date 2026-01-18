require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const seedSeniorCoach = require("./utils/seedSrCoach.js");

const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const coachRoutes = require('./routes/coaches');
const srRoutes = require('./routes/srcoach');

const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://3s-sports-dty3.vercel.app"
  ],
  credentials: true
}));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/coaches', coachRoutes);
app.use('/api/srcoach', srRoutes);

// health
app.get('/', (req, res) => res.send('Cricket Academy API running'));

// 🔥 START SERVER ONLY AFTER DB IS CONNECTED
const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // Run seed ONLY AFTER DB connection
    await seedSeniorCoach();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

  } catch (err) {
    console.error("Server startup error:", err);
    process.exit(1);
  }
};

startServer();
