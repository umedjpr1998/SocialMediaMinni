const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();


// SIGNUP
router.post('/signup', async (req, res) => {
    console.log('Signup request received:', req.body); // Log the request body
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User  already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User  created successfully' });
    } catch (err) {
        console.error('Error creating user:', err); // Log the error
        res.status(500).json({ message: 'Error creating user' });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    console.log('Login request received:', req.body); // Log the request body
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

        res.status(200).json({
            message: 'Login successful',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        });

    } catch (err) {
        console.error('Error logging in:', err); // Log the error
        res.status(500).json({ message: 'Error logging in' });
    }
});





module.exports = router;
