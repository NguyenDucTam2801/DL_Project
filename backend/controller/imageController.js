const { predictImage } = require('../models/tfModel');

const processImage = async (req, res) => {
    try {
        try {
            const predictions = await predictImage(req.body.image);
            console.log('Predictions:', predictions);
            res.status(200).json({ predictions });
        } catch (error) {
            console.error('Error processing image:', error);
            res.status(500).send('Error processing image');
        }
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ error: 'Failed to process image' });
    }
    // res.send('Image processed successfully');
};

module.exports = { processImage };