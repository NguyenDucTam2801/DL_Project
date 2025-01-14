const axios = require('axios');
let model;
const tf = fetchTensorFlowJs();


async function fetchTensorFlowJs() {
    try {
        const url = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs';
        const response = await axios.get(url);
        eval(response.data);
        // TensorFlow.js is now available as a global object
        console.log('TensorFlow.js initialized:', tf);
        tf.then(result => {
            console.log("Result", result)
            return result
        })  
    } catch (error) {
        console.error('Error fetching TensorFlow.js:', error);
    }
}

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
    loadModel();
    if (!model) throw new Error('Model is not loaded');
    if (!Buffer.isBuffer(imageBuffer)) throw new Error('Invalid input: Expected a buffer.');

    const tensor = tf.node.decodeImage(imageBuffer)
        .resizeNearestNeighbor([128, 128]) // Adjust to model input shape
        .toFloat()
        .expandDims(0); // Add batch dimension

    try {
        const predictions = model.predict(tensor);
        const output = await predictions.array(); // Get predictions as a JavaScript array
        console.log("Out predict", out)
        return output;
    } catch (error) {
        console.error('Prediction error:', error);
        throw error;
    } finally {
        tensor.dispose();
    }
}



module.exports = { predictImage };
