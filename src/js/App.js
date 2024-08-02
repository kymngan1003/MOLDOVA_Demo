import React, {useState, useRef} from 'react';
import '../scss/Common.scss';
import '../scss/App.scss';
import RegisterPreviewPopup from "./RegisterPreviewPopup";
import IdentifyCheck from "./IdentifyCheck"

import strengthImg from '../image/strength.png';
import headerLineImg from '../image/headerLine.png';

import useWebcam from './common/useWebcam';
import captureImage from "./common/captureImage";
function App() {

    // const videoRef = useRef(null);
    const videoRef = useWebcam();
    const canvasRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageBase64, setImageBase64] = useState(null);
    const [isPreviewPopupOpen, setIsPreviewPopupOpen] = useState(false);

    const handleCanPlay = () => {
        videoRef.current.play();
    };

    // register by file
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageBase64(reader.result.replace(/^data:image\/(jpeg|png|gif|webp);base64,/, ''));
            };
            reader.readAsDataURL(file);
            setIsPreviewPopupOpen(true);
        }
    };
    const handleClosePopup = () => {
        setSelectedImage(null);
        setIsPreviewPopupOpen(false);
        document.getElementById('fileInput').value = null;
    };

    //capture
    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const imageCaptureUrl = captureImage(videoRef);
            setIsPreviewPopupOpen(true);
            const base64String = imageCaptureUrl.split(',')[1];
            setSelectedImage(imageCaptureUrl);
            setImageBase64(base64String);

        } else {
            console.error("Video or canvas reference is null.");
        }
    };


    return (
        <div className="App max-width-page">
            <div className="identifier-register margin-bottom-70">
                <div className="identifier-register-strength">
                    <img src={strengthImg} alt="identifier Register Fuction"/>
                </div>
                <div className="identifier-register-content margin-left-10">
                    <div className="identifier-register-content-intro margin-bottom-50">
                        <h1 className="identifier-header margin-bottom-70">
                            Facial Recognition System
                            <img src={headerLineImg} alt="Line"/>
                        </h1>

                        <p className="identifier-register-content-intro-text">
                            Register an image from an ID or a captured image, and then you will receive an identifier
                            associated with that image.
                        </p>
                    </div>
                    <div>
                        <div className="identifier-register-content-camera">
                            <video ref={videoRef} width="100%" height="100%" onLoadedMetadata={handleCanPlay}/>
                            <canvas ref={canvasRef} style={{display: 'none'}} width="100%" height="100%"></canvas>
                        </div>
                        <div className="identifier-register-content-btn">
                        <div id="registerByFile" className="margin-bottom-30">

                                <button onClick={() => document.getElementById('fileInput').click()}
                                        className="btn btn-mainColor">
                                    Register With File
                                </button>
                                <input
                                    type="file"
                                    id="fileInput"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleImageChange}
                                />
                            </div>

                            <div id="registerByCapture">
                                <button className="btn btn-mainColor" onClick={handleCapture}>
                                    Register With Capture
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {isPreviewPopupOpen && (
                    <RegisterPreviewPopup
                        selectedImage={selectedImage}
                        imageBase64={imageBase64}
                        handleClosePopup={handleClosePopup} />
                )}
            </div>
            <div className="identifier-find">
                <IdentifyCheck></IdentifyCheck>
            </div>
        </div>
    );
}

export default App;
