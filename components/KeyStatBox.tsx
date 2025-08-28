import React from 'react';
import TrendingUpIcon from './icons/TrendingUpIcon';

interface KeyStatBoxProps {
    value: string;
    label: string;
}

const KeyStatBox: React.FC<KeyStatBoxProps> = ({ value, label }) => {
    return (
        <div className="key-stat-box my-8">
            <div className="key-stat-icon">
                <TrendingUpIcon className="w-8 h-8" />
            </div>
            <div className="key-stat-content">
                <div className="key-stat-value">{value}</div>
                <div className="key-stat-label">{label}</div>
            </div>
        </div>
    );
};

export default KeyStatBox;
