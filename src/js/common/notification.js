import React from 'react';
import { CiCircleCheck } from "react-icons/ci";
import { CiWarning } from "react-icons/ci";
import { MdErrorOutline } from "react-icons/md";
import { CiSquareInfo } from "react-icons/ci";
import '../../scss/Common.scss';

const Notification = ({message, type}) => {
    return (

        <div className={"notification-popup " + type}>
                {(type === "success") &&
                    <span className="notification-popup-header">
                        <CiCircleCheck className="margin-right-5 icon"/>
                        Success
                    </span>
                }
                {(type === "warning") &&
                    <span className="notification-popup-header">
                        <CiWarning className="margin-right-5 icon"/>
                        Warning
                    </span>
                }
                {(type === "error") &&
                    <span className="notification-popup-header">
                        <MdErrorOutline className="margin-right-5 icon"/>
                        Error
                    </span>
                }
                {(type === "info") &&
                    <span className="notification-popup-header">
                        <CiSquareInfo className="margin-right-5 icon"/>
                        Info
                    </span>
                }
                <p className="notification-popup-msg">{message}</p>
        </div>
    );
};

export default Notification;
