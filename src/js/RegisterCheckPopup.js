import React, {useState, useRef} from 'react';
import '../scss/Common.scss';
import '../scss/RegisterPopup.scss';
import useWebcam from './common/useWebcam';
import LoadingEffect from "./common/loadingEffect";
import headerLineImg from "../image/headerLine.png";
import captureImage from "./common/captureImage";
const RegisterCheckPopup = ({ apiCreateResult,handleClosePopup,onGetHistoryData}) => {
    const videoRef = useWebcam();
    const canvasRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const base64String = apiCreateResult.image;
    const [imageUrl, setImageUrl] = useState(`data:image/png;base64,${base64String}`);
    const idReplace = apiCreateResult.id;
    const [historyItem, setHistoryItem] = useState({
        id: apiCreateResult.id,
        image: `data:image/png;base64,${base64String}`
    });


    const handleCaptureImage = async () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;

        if (canvas && video) {
            const imageCaptureUrl = captureImage(videoRef);
            const base64String = imageCaptureUrl.split(",")[1];

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
                const newImageUrl = `data:image/png;base64,${base64Image}`;

                setImageUrl(newImageUrl);
                setHistoryItem((prevState) =>({
                    ...prevState,
                    image: newImageUrl
                }));
            } catch (error) {
                setErrorMessage(error.message.split(', '));
                setImageUrl(imageCaptureUrl);
            } finally {
                setLoading(false);
            }
        }
    };
    const handleSendHistory = () => {
        onGetHistoryData(historyItem);
        handleClosePopup();
    }


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
                            <button className="btn btn-mainColor margin-right-15" onClick={handleCaptureImage}>Retry</button>
                            <button className="btn btn-mainColor" onClick={handleSendHistory}>Complete</button>
                        </div>
                        {loading && (<LoadingEffect></LoadingEffect>)}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default RegisterCheckPopup;
