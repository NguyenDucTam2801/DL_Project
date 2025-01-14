const express = require('express');
const multer = require('multer');
const { processImage } = require('./controller/imageController');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// File upload handling
const upload = multer({ storage: multer.memoryStorage() });

// Routes
app.get('/', (req, res) => {
    res.send('Hello from TensorFlow.js');
});
app.post('/predict',express.raw({ type: 'image/*', limit: '5mb' }) ,upload.single('image'), processImage);

// Start server
(async () => {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
})();