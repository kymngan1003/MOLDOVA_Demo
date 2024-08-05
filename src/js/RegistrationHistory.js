import React from 'react';
import '../scss/Common.scss';
import '../scss/RegistrationHistory.scss';

const RegistrationHistory = ({historyList}) => {

    return (
        <div className="history">
            <h2 className="history-header margin-bottom-30">Recent Recognized</h2>
            {historyList.map((item, index) => (
                <div key={index} className="history-item">
                    <div className="history-item-img margin-bottom-20">
                        <img src={item.image} alt="Registered Image"/>
                    </div>
                    <div className="history-item-number">
                        ID: {item.id}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RegistrationHistory;
