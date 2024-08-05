import { useRef, useEffect } from 'react';

const useWebcam = () => {
    const videoRef = useRef(null);

    useEffect(() => {
        const startWebcam = () => {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices
                .getUserMedia({ video: true })
                .then((stream) => {
                    const video = videoRef.current;
                    if (video) {
                        video.srcObject = stream;
                        video.setAttribute('playsinline', '');
                        video.addEventListener("loadeddata", () => {
                            video.play();
                        });
                    }
                })
                .catch((err) => {
                    alert("Error accessing webcam: " + err);
                });
        } else {
                alert('Media Devices API not supported.');
            }
        };
        startWebcam();
    }, []);

    return videoRef;
};

export default useWebcam;
