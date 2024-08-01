import React, {useRef, useState, useEffect} from "react";
import LoadingEffect from "./loadingEffect";
import '../scss/IdentifyCheck.scss'
import useWebcam from './/useWebcam';
const IdentifyCheck = () => {
    const [imageSrc, setImageSrc] = useState(null);

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dataFetched, setDataFetched] = useState(false); // Check api have call already?
    const [errorMessage, setErrorMessage] = useState('');
    const videoRef = useWebcam();
    const canvasRef = useRef(null);

    const capturePhoto = async () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (canvas && video) {
            const context = canvas.getContext("2d");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            setImageSrc(canvas.toDataURL('image/png'));
            const base64Image = canvas.toDataURL("image/png");
            const base64String = base64Image.split(",")[1];

            setLoading(true);
            setDataFetched(false);
            setErrorMessage('');
            try {
                const response = await fetch("/moldova/v2/identity/check", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({image: base64String}),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    const errorMessages = errorData.map(error => error.defaultMessage);
                    throw new Error(errorMessages.join(', '));
                }

                const result = await response.json();
                setData(result);
            } catch (error) {
                setErrorMessage(error.message.split(', '));
                setData(null);
            } finally {
                setLoading(false);
                setDataFetched(true);
            }
        }
    };

    return (
        <div className="identifier-find-component">
            <button className="identifier-find-btn btn btn-whiteColor" onClick={capturePhoto}>Find</button>
            <div>
                <video ref={videoRef} style={{display: "none"}}/>
                <canvas ref={canvasRef} style={{display: "none"}}/>

                {loading && (<LoadingEffect></LoadingEffect>)}

                {errorMessage.length > 0 && (
                    <ul className="error-messages margin-top-20">
                        {errorMessage.map((error, index) => (
                            <li key={index} className="margin-bottom-30">{error}</li>
                        ))}
                    </ul>
                )}
                {!loading && dataFetched && data && (
                        <div className="result margin-top-20">
                            <div className="image-result">
                                {imageSrc && (
                                    <img src={imageSrc} alt="Captured" className="images-find"/>
                                )}
                            </div>
                            <div className="contents">
                                <p className="margin-top-20">ID: {data.id}</p>
                                <p className="margin-top-10">Distance: {data.distance.toFixed(1)}</p>
                                <p className="margin-top-10">Similarity: {data.similarity.toFixed(1)}</p>
                            </div>
                        </div>
                ) }
            </div>
        </div>
    );
};

export default IdentifyCheck;