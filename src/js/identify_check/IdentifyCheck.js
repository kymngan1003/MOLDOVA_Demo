import React, { useRef, useState, useEffect } from 'react';



const IdentifyCheck = () => {
  
  // const [imageSrc, setImageSrc] = useState(null);
  const [base64, setbase64] = useState(null)
  const [distance, setDistance] = useState(null);
  const [similarity, setSimilarity] = useState(null);
  const [id, setId] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);


  useEffect(() => {
    const startWebcam = () => {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          const video = videoRef.current;
          if (video) {
            video.srcObject = stream;
            video.addEventListener('loadeddata', () => {
              video.play();

            });
          }
        })
        .catch(err => {
          console.error("Error accessing webcam: ", err);
        });
    };
    startWebcam();
  }, []);

  const capturePhoto = async  () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      // setImageSrc(canvas.toDataURL('image/png'));
      const base64Image = canvas.toDataURL('image/png');
      const base64String = base64Image.split(',')[1];
      setbase64(base64String)

      try {
        const response = await fetch('/moldova/v2/identity/check', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: base64String }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        setDistance(result.distance);
        setSimilarity(result.similarity);
        setId(result.id)

      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    }

  };


  return (
    <div>
      <button onClick={capturePhoto}>Capture Photo</button>
      <div>
        <video ref={videoRef} style={{ display: 'none' }} />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        {/* {imageSrc && <img src={imageSrc} alt="Captured" style={{ width: '300px' }} />} */}
        <div>
          <h3>Id</h3>
          <p>{id}</p>
          <h3>Distance:</h3>
          <p>{distance}</p>
          <h3>Similarity:</h3>
          <p>{similarity}</p>
        </div>

      </div>
    </div>
  );
};


export default IdentifyCheck;