const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 🚨 BULLETPROOF CORS: This stops the Network Error 🚨
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());

// DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Database Connected Successfully! 🚀'))
    .catch(err => console.log('❌ Database Connection Failed:', err));

// USER SCHEMA
const UserSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

// ROUTES
app.get('/', (req, res) => {
    res.send('Blood Donation API is running! 🩸');
});

// REGISTER ROUTE
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) return res.status(400).json({ message: 'User already exists with this email' });

        const newUser = new User({ name, email: email.toLowerCase(), password });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// LOGIN ROUTE
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) return res.status(400).json({ message: 'User not found' });
        if (user.password !== password) return res.status(400).json({ message: 'Invalid password' });

        // Sends back the user ID so the frontend can log them in
        res.status(200).json({ user: { id: user._id, name: user.name } });
    } catch (error) {
        res.status(500).json({ message: 'Server error during login' });
    }
});

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});