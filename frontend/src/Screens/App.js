import './App.css';
import React, { useRef, useEffect, useState } from "react";
import { getPrediction } from '../Services/PredictService';

function App() {


  const videoRef = useRef(null);
  

  const [prediction, setPrediction] = useState('');

  const ratio = 1920 / 1080;

  const getVideo = () => {
    
    const width = window.innerWidth;

    navigator.mediaDevices.getUserMedia({
      video: {
        width: width,
        height: width / ratio
      }
    }).then(stream => {
      let video = videoRef.current;
      video.srcObject = stream;
      video.play();
    })
      .catch(err => {
        console.error("error:", err);
      });
  }

  useEffect(() => {
    getVideo();
  }, [videoRef]);

  useEffect(() => {
    setPrediction('Loading...');
    const interval = setInterval(async () => {
      const imageCapture = new ImageCapture(videoRef.current.srcObject.getVideoTracks()[0]);
      const image = await imageCapture.grabFrame();
      const prediction = await getPrediction(image);
      setPrediction(prediction.prediction);
    }, 1000);
    return () => clearInterval(interval);
  } , [videoRef]);

  return (
    <div className="App">
      <div className="camera">
        <video ref={videoRef}></video>
        <div className='prediction'>
          {prediction}
      </div>
      </div>
      
    </div>
  );
}

export default App;
