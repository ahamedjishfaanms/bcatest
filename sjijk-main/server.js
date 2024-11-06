const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Enable CORS for cross-origin requests
const app = express();
const port = 3000;

app.use(cors()); // Enable CORS to handle requests from different origins
app.use(bodyParser.json());
app.use(express.static('public'));

// Set up storage for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'image/'),
    filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

// Updated login credentials
const ADMIN_USERNAME = 'adminbca';
const ADMIN_PASSWORD = 'Bca@2024';

// Route to handle login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        res.send({ success: true });
    } else {
        res.status(401).send({ success: false });
    }
});

// Route to get existing slideshow images
app.get('/get-images', (req, res) => {
    fs.readdir('image', (err, files) => {
        if (err) {
            res.status(500).send([]);
        } else {
            const images = files.filter(file => /\.(jpg|jpeg|png|svg)$/i.test(file));
            res.json(images);
        }
    });
});

// Route to upload a new slideshow image (maximum of 4 images)
app.post('/upload-image', (req, res) => {
    fs.readdir('image', (err, files) => {
        if (err) {
            return res.status(500).send({ success: false });
        }
        const images = files.filter(file => /\.(jpg|jpeg|png|svg)$/i.test(file));
        if (images.length >= 4) {
            return res.status(400).send({ success: false, message: 'Maximum of 4 images allowed' });
        }
        upload.single('image')(req, res, function (uploadErr) {
            if (uploadErr) {
                return res.status(500).send({ success: false });
            }
            res.send({ success: true, path: `/image/${req.file.filename}` });
        });
    });
});

// Route to delete an image from the slideshow
app.delete('/remove-image', (req, res) => {
    const imageName = req.query.name;
    const imagePath = path.join(__dirname, 'image', imageName);

    fs.unlink(imagePath, err => {
        if (err) {
            res.status(500).send({ success: false });
        } else {
            res.send({ success: true });
        }
    });
});

// Temporary storage for announcements and events (in-memory)
let announcements = ["Announcement 1", "Announcement 2", "Announcement 3"];
let latestEvents = "Latest events and updates";

// Route to get announcements
app.get('/get-announcements', (req, res) => {
    res.json({ announcements });
});

// Route to get latest events
app.get('/get-events', (req, res) => {
    res.json({ latestEvents });
});

// Route to update announcements and events
app.post('/update-content', (req, res) => {
    const { announcements: newAnnouncements, latestEvents: newEvents } = req.body;

    if (newAnnouncements) announcements = newAnnouncements;
    if (newEvents) latestEvents = newEvents;

    res.send({ success: true });
});

// Serve static files for uploads (images)
app.use('/image', express.static(path.join(__dirname, 'image')));

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
