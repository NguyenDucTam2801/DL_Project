import './App.css';
import React, { useRef, useEffect, useState } from "react";
import { getPrediction } from '../Services/PredictService';

function App() {


  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [hasPrediction, setHasPrediction] = useState(false);

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

  return (
    <div className="App">
      <div className="camera">
        <video ref={videoRef}></video>
      </div>
      <div className={'prediction' + (hasPrediction ? 'hasPrediction' : '')}>
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}

export default App;
