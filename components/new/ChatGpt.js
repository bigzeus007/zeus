import React, { useState, useRef } from "react";

const Camera = () => {
  const [imageData, setImageData] = useState(null);
  const videoRef = useRef();
  const canvasRef = useRef();

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  const stopCamera = () => {
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => {
      track.stop();
    });
  };

  const takePicture = () => {
    const context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    const data = canvasRef.current.toDataURL("image/png");
    setImageData(data);
    stopCamera();
  };

  return (
    <>
      <div>
        {imageData ? (
          <img src={imageData} alt="Taken Picture" />
        ) : (
          <video ref={videoRef} autoPlay />
        )}
      </div>
      {!imageData && (
        <div>
          <button onClick={startCamera}>Activate Camera</button>
          <button onClick={takePicture}>Take Picture</button>
        </div>
      )}
      {imageData && (
        <div>
          <button onClick={() => setImageData(null)}>Take Another Picture</button>
          <button onClick={() => {
            const link = document.createElement('a');
            link.href = imageData;
            link.download = 'myPicture.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}>Save Picture</button>
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </>
  );
};

export default Camera;
