import * as tf from '@tensorflow/tfjs-node';

let model;

// Load the TensorFlow model
async function loadModel() {
    try {
        model = await tf.loadLayersModel(`../web_model/model.json`);
        console.log('Model loaded successfully.');
    } catch (error) {
        console.error('Error loading model:', error);
    }
}

// Perform predictions
async function predictImage(imageBuffer) {
    if (!model) throw new Error('Model is not loaded');
    if (!Buffer.isBuffer(imageBuffer)) throw new Error('Invalid input: Expected a buffer.');

    const tensor = tf.node.decodeImage(imageBuffer)
        .resizeNearestNeighbor([128, 128]) // Adjust to model input shape
        .toFloat()
        .expandDims(0); // Add batch dimension

    try {
        const predictions = model.predict(tensor);
        const output = await predictions.array(); // Get predictions as a JavaScript array
        return output;
    } catch (error) {
        console.error('Prediction error:', error);
        throw error;
    } finally {
        tensor.dispose();
    }
}

// Load the model at server startup
loadModel();

export { predictImage };
