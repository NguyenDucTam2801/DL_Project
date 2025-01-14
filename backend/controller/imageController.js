import { predictImage } from '../models/tfModel.js';

const processImage = async (req, res) => {
    try {
        const imageBuffer = req.file.buffer; // Image uploaded as a buffer
        const predictions = await predictImage(imageBuffer); // Get predictions
        res.json({ predictions }); // Send predictions back to client
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ error: 'Failed to process image' });
    }
    // res.send('Image processed successfully');
};

export { processImage };