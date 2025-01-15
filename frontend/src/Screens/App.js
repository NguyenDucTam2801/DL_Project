import './App.css';
import React, { useRef, useEffect, useState } from "react";
import * as tf from '@tensorflow/tfjs'; // Import TensorFlow.js

function App() {  
  const classes = { 0:'Speed limit (20km/h)',
    1:'Speed limit (30km/h)', 
    2:'Speed limit (50km/h)', 
    3:'Speed limit (60km/h)', 
    4:'Speed limit (70km/h)', 
    5:'Speed limit (80km/h)', 
    6:'End of speed limit (80km/h)', 
    7:'Speed limit (100km/h)', 
    8:'Speed limit (120km/h)', 
    9:'No passing', 
    10:'No passing veh over 3.5 tons', 
    11:'Right-of-way at intersection', 
    12:'Priority road', 
    13:'Yield', 
    14:'Stop', 
    15:'No vehicles', 
    16:'Veh > 3.5 tons prohibited', 
    17:'No entry', 
    18:'General caution', 
    19:'Dangerous curve left', 
    20:'Dangerous curve right', 
    21:'Double curve', 
    22:'Bumpy road', 
    23:'Slippery road', 
    24:'Road narrows on the right', 
    25:'Road work', 
    26:'Traffic signals', 
    27:'Pedestrians', 
    28:'Children crossing', 
    29:'Bicycles crossing', 
    30:'Beware of ice/snow',
    31:'Wild animals crossing', 
    32:'End speed + passing limits', 
    33:'Turn right ahead', 
    34:'Turn left ahead', 
    35:'Ahead only', 
    36:'Go straight or right', 
    37:'Go straight or left', 
    38:'Keep right', 
    39:'Keep left', 
    40:'Roundabout mandatory', 
    41:'End of no passing', 
    42:'End no passing veh > 3.5 tons' }

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  let model;
  const [frame, setFrameData] = useState();


  const [prediction, setPrediction] = useState('');

  const ratio = 1920 / 1080;

  const getVideo = () => {

    const width = 256;
    const height = width

    navigator.mediaDevices.getUserMedia({
      video: {
        width: width,
        height: height
      }
    }).then(stream => {
      let video = videoRef.current;
      video.srcObject = stream;
      // Show loading animation.
      var playPromise = video.play();

      if (playPromise !== undefined) {
        playPromise.then(_ => {
          // Automatic playback started!
          // Show playing UI.
        })
          .catch(error => {
            // Auto-play was prevented
            // Show paused UI.
            setPrediction(''); // Clear the prediction when the video is paused.
          });
      }
    }).catch(err => {
      console.error('error:', err);
    });


  }


  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await tf.loadLayersModel('http://127.0.0.1:8080/model.json');
        // console.log('Model loaded', loadedModel);
        model=loadedModel;
      } catch (error) {
        console.error('Error loading model:', error);
      }
    };

    loadModel();
    getVideo();
    console.log("frame", frame);
  }, [videoRef]);

  useEffect(() => {
    setPrediction('Getting prediction...');
    const interval = setInterval(async () => {
      const imageCapture = new ImageCapture(videoRef.current.srcObject.getVideoTracks()[0]);
      const image = await imageCapture.grabFrame();
      setFrameData(image);

      // Draw the frame on the canvas
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0, image.width, image.height);

      // Preprocess the image for the model
      const tensor = tf.browser.fromPixels(canvas)
        .resizeNearestNeighbor([128, 128]) // Adjust size as per model input
        .toFloat()
        .expandDims(0);
      // Run the model
      if (model) {
        const predictions = model.predict(tensor);

        // Option 1: Print predictions as a nested array (recommended for clarity)
        const fullArray = await predictions.array();
        // console.log('Predictions (Nested Array):', fullArray);

        // Option 2: Print predictions as a flat array
        const flatArray = predictions.dataSync();
        const maxValue = Math.max(...flatArray);
        // console.log("max value: ", maxValue)
        console.log("index Of max: ",flatArray.indexOf(maxValue))
        const resultArray = flatArray.map(value => (value === maxValue ? 1 : 0));

        let index = resultArray.indexOf(1);
        let result = classes[index];
        console.log('Predictions (Flat Array):', flatArray);
        console.log('Predictions: ', result);

        tensor.dispose();
        setPrediction(result)
      } else {
        console.error('Model is not loaded');
        setPrediction("Error loading Model")
      }

      // Process predictions (customize for your model)

      // const prediction = await getPrediction(image,model,canvas,ctx,img);
      // console.log("prediction", prediction);
    }, 1000);
    return () => clearInterval(interval);
  }, [videoRef]);

  return (
    <div className="App">
      <div className="camera">
        <video ref={videoRef}></video>
        <div className='prediction'>
          {prediction}
        </div>


      </div>
      <canvas
        ref={canvasRef}
        style={{
          display: frame ? "block" : "none",
          marginTop: "20px",
          border: "1px solid #ccc",
          
        }}      ></canvas>
      <h1 style={{ color: "white"}}>Frame Capture From video</h1>
    </div>
  );
}

export default App;
