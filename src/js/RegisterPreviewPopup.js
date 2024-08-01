import React, {useState} from 'react';
import axios from 'axios';
import '../scss/Common.scss';
import '../scss/RegisterPopup.scss';
import RegisterCheckPopup from "./RegisterCheckPopup";
import LoadingEffect from "./loadingEffect";
import headerLineImg from "../image/headerLine.png";

const RegisterPreviewPopup = ({selectedImage, imageBase64, handleClosePopup}) => {
    const [isCheckPopupOpen, setIsCheckPopupOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [apiResult, setApiResult] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const apiCreateCall = async () => {
        const randomId = Math.floor(Math.random() * 10000000);
        setLoading(true);
        setErrorMessage('');
        try {
            const response = await fetch('/moldova/v2/identity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: randomId,
                    image: imageBase64
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessages = errorData.map(error => error.defaultMessage);
                throw new Error(errorMessages.join(', '));
            }

            const result = await response.json();
            setApiResult(result);
            setIsCheckPopupOpen(true);
        } catch (error) {
            setErrorMessage(error.message.split(', '));
            setIsCheckPopupOpen(false);
            setApiResult(null);
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="popup">
            <section className="popup-main">
                {!isCheckPopupOpen && (
                    <div className="identifier-register-preview">
                        <h1 className="identifier-header margin-bottom-70">
                            Register Identification
                            <img src={headerLineImg} alt="Line"/>
                        </h1>
                        <h2 className="identifier-register-header margin-bottom-30">Preview</h2>

                        <div className="identifier-register-img margin-bottom-50">
                            <img src={selectedImage} alt="Preview" className="image-preview margin-bottom-50"/>
                        </div>

                        {errorMessage.length > 0 && (
                            <ul className="error-messages">
                                {errorMessage.map((error, index) => (
                                    <li key={index} className="margin-bottom-30">{error}</li>
                                ))}
                            </ul>
                        )}
                        <div className="btn-group">
                            <button className="btn btn-mainColor margin-right-15"
                                    onClick={apiCreateCall}
                            >Create
                            </button>
                            <button className="btn btn-mainColor" onClick={handleClosePopup}>Close</button>
                        </div>
                        {loading && (<LoadingEffect></LoadingEffect>)}
                    </div>
                )}

                {isCheckPopupOpen && (
                    <RegisterCheckPopup
                        apiCreateResult={apiResult}
                        handleClosePopup={handleClosePopup}
                    />
                )}

            </section>
        </div>
    );
};

export default RegisterPreviewPopup;
