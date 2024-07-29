import React, {useState} from 'react';
import '../scss/Common.scss';
import '../scss/App.scss';
import RegisterPreviewPopup from "./RegisterPreviewPopup";

import securityImg from '../image/security.png';
import accuracyImg from '../image/accuracy.png';
import speedImg from '../image/speed.png';
import applicationImg from '../image/versatileApplication.png';

function App() {
    const [showPopup, setShowPopup] = useState(false);

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    return (
        <div className="App max-width-page">
            <div className="identifier-register margin-bottom-70">
                <div className="identifier-register-function margin-bottom-50">
                    <div className="identifier-register-function-item leftItem margin-bottom-15">
                        <img src={securityImg} alt="identifier Register Fuction"/>
                    </div>
                    <div className="identifier-register-function-item rightItem margin-bottom-15">
                        <img src={accuracyImg} alt="identifier Register Fuction"/>
                    </div>
                    <div className="identifier-register-function-item leftItem margin-bottom-15">
                        <img src={speedImg} alt="identifier Register Fuction"/>
                    </div>
                    <div className="identifier-register-function-item rightItem">
                        <img src={applicationImg} alt="identifier Register Fuction"/>
                    </div>
                </div>
                <div className="identifier-register-content">
                    <div className="identifier-register-intro margin-bottom-50">
                        <h1 className="identifier-register-intro-header margin-bottom-30">
                            Facial Recognition System
                        </h1>
                        <p className="identifier-register-intro-content">
                            Register an image from an ID or a captured image, and then you will receive an identifier
                            associated with that image.
                        </p>
                    </div>
                    <div className="margin-bottom-50">
                        <div className="identifier-register-content-camera"></div>
                        <div className="identifier-register-content-btn">
                            <div id="registerByFile" className="margin-bottom-30">
                                <button className="btn btn-mainColor" onClick={togglePopup}>Register With File</button>
                                <RegisterPreviewPopup show={showPopup} handleClose={togglePopup}>
                                    <h2>Popup Content</h2>
                                    <p>This is the content inside the popup.</p>
                                </RegisterPreviewPopup>
                            </div>

                            <div id="registerByCapture">
                                <button className="btn btn-mainColor" onClick={togglePopup}>Register With Capture</button>
                                <RegisterPreviewPopup show={showPopup} handleClose={togglePopup}>
                                    <h2>Popup Content</h2>
                                    <p>This is the content inside the popup.</p>
                                </RegisterPreviewPopup>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="identifier-find">
                <button className="identifier-find-btn btn btn-whiteColor">Find</button>
                <div className="identifier-find-result">

                </div>
            </div>
        </div>
    );
}

export default App;
