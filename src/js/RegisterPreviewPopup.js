import React from 'react';
import '../scss/Common.scss';
import '../scss/RegisterPopup.scss';

const RegisterPreviewPopup = ({ show, handleClose, children }) => {
    const showHideClassName = show ? "popup display-flex" : "popup display-none";

    return (
        <div className={showHideClassName}>
            <section className="popup-main">
                {children}
                <button onClick={handleClose}>Create</button>
                <button onClick={handleClose}>Close</button>
            </section>
        </div>
    );
};

export default RegisterPreviewPopup;
