import React, {useRef, useState, useEffect} from "react";
import LoadingEffect from "./common/loadingEffect";
import '../scss/IdentifyCheck.scss'
import useWebcam from './common/useWebcam';
import captureImage from "./common/captureImage";
import Notification from "./common/notification";

const IdentifyCheck = () => {
    const [imageSrc, setImageSrc] = useState(null);

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dataFetched, setDataFetched] = useState(false); // Check api have call already?
    const [errorMessage, setErrorMessage] = useState('');
    const videoRef = useWebcam();
    const canvasRef = useRef(null);
    const [isDelete, setIsDelete] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const findApiCall = async () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (canvas && video) {
            const imageCaptureUrl = captureImage(videoRef);
            const base64String = imageCaptureUrl.split(",")[1];

            setImageSrc(imageCaptureUrl);
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

    const deleteApiCall = async () => {
        setDeleteLoading(true)
        try {
            const response = await fetch("/moldova/v2/identity/" + data.id, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessages = errorData.map(error => error.defaultMessage);
                throw new Error(errorMessages.join(', '));
            }

            // const result = await response.json();
            setData(null);
            setIsDelete(true);
            setDeleteLoading(false)
            setTimeout(() => {
                setIsDelete(false);
            }, 4000);

        } catch (error) {
            setErrorMessage(error.message.split(', '));
        } finally {
            setLoading(false);
            setDataFetched(true);
        }
    }

    return (
        <div className="identifier-find-component">
            <button className="identifier-find-btn btn btn-mainColor margin-vertical-50" onClick={findApiCall}>Find</button>
            <div>
                <video ref={videoRef} style={{display: "none"}}/>
                <canvas ref={canvasRef} style={{display: "none"}}/>

                {loading && (<LoadingEffect></LoadingEffect>)}
                {deleteLoading && (<LoadingEffect></LoadingEffect>)}
                {errorMessage.length > 0 && (
                    <ul className="error-messages margin-top-20">
                        {errorMessage.map((error, index) => (
                            <li key={index} className="margin-bottom-30">{error}</li>
                        ))}
                    </ul>
                )}
                {!loading && dataFetched && data && (
                    <div className="result margin-bottom-50">
                        <div className="image-result">
                            {imageSrc && (
                                <img src={imageSrc} alt="Captured" className="images-find"/>
                            )}
                        </div>
                        <div className="contents">
                            <p className="margin-top-20">ID: {data.id}</p>
                            <p className="margin-top-10">Distance: {data.distance.toFixed(1)}</p>
                            <p className="margin-top-10">Similarity: {data.similarity.toFixed(1)}</p>
                            <button className="margin-top-15 btn btn-whiteColor" onClick={deleteApiCall}>Delete</button>
                        </div>
                    </div>
                )}
                {isDelete && (
                    <Notification type="success" message="Facial recognition deregistration successfu"></Notification>
                )}
            </div>
        </div>
    );
};

export default IdentifyCheck;