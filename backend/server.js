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

// In production (Vercel), use serverless-friendly connection management
if (process.env.VERCEL) {
    let isConnected = false;
    app.use(async (req, res, next) => {
        if (!process.env.MONGO_URI) {
            return res.status(500).json({ error: 'CRITICAL: MONGO_URI is missing in production environment variables.' });
        }
        if (!isConnected) {
            try {
                await mongoose.connect(process.env.MONGO_URI, {
                    serverSelectionTimeoutMS: 5000 // fail early if IP is blocked
                });
                isConnected = true;
                console.log('Connected to remote MongoDB');
            } catch (err) {
                console.error('MongoDB connection error:', err);
                return res.status(500).json({ error: 'Database connection failed. Check if IP 0.0.0.0/0 is allowed in Atlas and your password is correct.', details: err.message });
            }
        }
        next();
    });
}

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

// Serve frontend static files
const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

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

if (!process.env.VERCEL) {
    startServer();
}

// Export for Vercel Serverless
module.exports = app;
