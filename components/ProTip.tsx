import React from 'react';
import LightbulbIcon from './icons/LightbulbIcon';
import '../styles/ProTip.css';

interface ProTipProps {
    content: string;
}

const ProTip: React.FC<ProTipProps> = ({ content }) => (
    <div className="pro-tip-box">
        <div className="pro-tip-icon-wrapper">
            <LightbulbIcon className="pro-tip-icon" />
        </div>
        <div className="pro-tip-content">
            <h4 className="pro-tip-header">Pro Tip</h4>
            <p className="pro-tip-text">{content}</p>
        </div>
    </div>
);

export default ProTip;