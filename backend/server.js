require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const notesRoutes = require('./routes/notes.routes');
const quizRoutes = require('./routes/quiz.routes');
const feedbackRoutes = require('./routes/feedback.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Main route
app.get('/', (req, res) => {
    res.send('SkillBridge AI Backend is running.');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);

// Connect to MongoDB - uses in-memory server for local dev if no external MongoDB
async function startServer() {
    let mongoUri = process.env.MONGO_URI;
    // Use MONGO_URI if provided, otherwise fallback to MongoMemoryServer for development
    if (!mongoUri) {
        try {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongod = await MongoMemoryServer.create();
            mongoUri = mongod.getUri();
            console.log('Using in-memory MongoDB for development (Fallback)');
        } catch (e) {
            console.log('mongodb-memory-server not available, and no MONGO_URI provided.');
        }
    } else {
        console.log(`Using provided MongoDB URI: ${mongoUri.includes('127.0.0.1') || mongoUri.includes('localhost') ? 'Local Database' : 'Remote Database'}`);
    }

    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
}

startServer();

