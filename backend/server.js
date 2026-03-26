const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 
require('dotenv').config(); 

const app = express();
app.use(express.json());
app.use(cors());

// 1. Connect to Database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Database Connected Successfully! 🚀"))
  .catch((error) => console.log("Database Connection Failed ❌:", error.message));

const User = require('./models/user');

// ==========================================
// 2. THE REGISTRATION ROUTE (SIGN UP)
// ==========================================
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, bloodGroup, city, phone } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) return res.status(400).json({ message: "User already exists!" });

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      bloodGroup: bloodGroup || 'O+',
      city: city || 'Unknown',
      phone: phone || '0000000000'
    });

    await newUser.save();
    console.log(`New User Created: ${email}`); // This shows in your VS Code terminal
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.log("Error saving user:", error.message);
    res.status(500).json({ message: "Server error during registration." });
  }
});

// ==========================================
// 3. THE LOGIN ROUTE (SIGN IN)
// ==========================================
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user - we make sure to lowercase the email to match the database
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
        console.log(`Login Failed: User ${email} not found in database.`);
        return res.status(400).json({ message: "User not found!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password!" });

    console.log(`Login Successful: ${email}`);
    res.json({ user: { id: user._id, name: user.name } });
  } catch (error) {
    res.status(500).json({ message: "Server error during login." });
  }
});

app.get('/api/donors', async (req, res) => {
  try {
    const donors = await User.find().select('-password');
    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching donors" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));