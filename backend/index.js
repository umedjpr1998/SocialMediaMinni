// server.js or app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const Photo = require('./models/Photo'); // Assuming you have a Photo model
const authRoutes = require('./routes/authRoutes'); // Import your auth routes

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Photo upload route
app.post('/api/photos/upload', upload.single('photo'), async (req, res) => {
    try {
        // Create a stream to upload the image
        const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },
            async (error, result) => {
                if (error) {
                    console.error('Upload error:', error);
                    return res.status(500).json({ message: 'Upload failed' });
                }

                // Create a new photo document
                const newPhoto = new Photo({
                    title: req.body.title,
                    url: result.secure_url,
                });

                await newPhoto.save();
                res.status(201).json({ photo: newPhoto });
            }
        );

        // Pipe the buffer to the stream
        stream.end(req.file.buffer);
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Upload failed' });
    }
});


// Use auth routes
app.use('/api', authRoutes); // Register the auth routes

// DB connection + server start
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    })
    .catch((err) => console.log(err));
