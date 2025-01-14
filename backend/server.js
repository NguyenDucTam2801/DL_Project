import express from 'express';
import multer from 'multer';
import path from 'path';
import { processImage } from './controller/imageController.js';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// File upload handling
const upload = multer({ storage: multer.memoryStorage() });

// Routes
app.get('/', (req, res) => {
    res.send('Hello from TensorFlow.js');
});
app.post('/upload', upload.single('image'), processImage);

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
