const captureImage = (videoRef) => {
    if (videoRef.current && videoRef.current.readyState === 4) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        const videoWidth = videoRef.current.videoWidth;
        const videoHeight = videoRef.current.videoHeight;
        const sideLength = Math.min(videoWidth, videoHeight);

        canvas.width = sideLength;
        canvas.height = sideLength;

        context.drawImage(
            videoRef.current,
            (videoWidth - sideLength) / 2,
            (videoHeight - sideLength) / 2,
            sideLength,
            sideLength,
            0,
            0,
            sideLength,
            sideLength
        );

        return canvas.toDataURL('image/png');
    } else {
        console.log('Video not ready');
        return null;
    }
};

export default captureImage;
