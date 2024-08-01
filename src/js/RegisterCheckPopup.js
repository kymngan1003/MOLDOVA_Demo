import React, {useState, useRef} from 'react';
import '../scss/Common.scss';
import '../scss/RegisterPopup.scss';
import useWebcam from './/useWebcam';
import LoadingEffect from "./loadingEffect";
import headerLineImg from "../image/headerLine.png";
const RegisterCheckPopup = ({ apiCreateResult,handleClosePopup}) => {
    const videoRef = useWebcam();
    const canvasRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const base64String = apiCreateResult.image;
    const [imageUrl, setImageUrl] = useState(`data:image/png;base64,${base64String}`);
    const idReplace = apiCreateResult.id;


    const captureImage = async () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;

        if (canvas && video) {
            const context = canvas.getContext("2d");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const base64Image = canvas.toDataURL("image/png");
            const base64String = base64Image.split(",")[1];

            setLoading(true);
            setErrorMessage('');
            try {
                const response = await fetch('/moldova/v2/identity/' + idReplace, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        image: base64String
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    const errorMessages = errorData.map(error => error.defaultMessage);
                    throw new Error(errorMessages.join(', '));
                }

                const result = await response.json();
                const base64Image = result.image;
                setImageUrl(`data:image/png;base64,${base64Image}`);
            } catch (error) {
                setErrorMessage(error.message.split(', '));
            } finally {
                setLoading(false);
            }
        }
    };


    return (
        <div>
            <video ref={videoRef} style={{display: 'none'}} width="100%" height="100%"/>
            <canvas ref={canvasRef} style={{display: 'none'}} width="100%" height="100%"></canvas>
            <div className="popup">
                <section className="popup-main">
                    <div className="identifier-register-check">
                        <h1 className="identifier-header margin-bottom-70">
                            Register Identification
                            <img src={headerLineImg} alt="Line"/>
                        </h1>

                        <h2 className="identifier-register-header margin-bottom-30">Check Cropped Image</h2>

                        <div className="identifier-register-img margin-bottom-50">
                            <img src={imageUrl} alt="Preview" className="image-preview "/>
                        </div>

                        {errorMessage.length > 0 && (
                            <ul className="error-messages">
                                {errorMessage.map((error, index) => (
                                    <li key={index} className="margin-bottom-30">{error}</li>
                                ))}
                            </ul>
                        )}
                        <div className="btn-group">
                            <button className="btn btn-mainColor margin-right-15" onClick={captureImage}>Retry</button>
                            <button className="btn btn-mainColor" onClick={handleClosePopup}>Complete</button>
                        </div>
                        {loading && (<LoadingEffect></LoadingEffect>)}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default RegisterCheckPopup;
