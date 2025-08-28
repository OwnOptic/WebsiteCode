import React from 'react';
import WarningIcon from './icons/WarningIcon';

interface WarningBoxProps {
    content: string;
}

const WarningBox: React.FC<WarningBoxProps> = ({ content }) => (
    <div className="warning-box">
        <div className="warning-box-icon">
            <WarningIcon className="h-5 w-5 text-yellow-500" />
        </div>
        <div className="warning-box-content">
            <p className="warning-box-text">{content}</p>
        </div>
    </div>
);

export default WarningBox;
