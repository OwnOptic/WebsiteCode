import React from 'react';
import LightbulbIcon from './icons/LightbulbIcon';
import '../styles/LearningBox.css';

interface LearningBoxProps {
    title: string;
    children: React.ReactNode;
}

const LearningBox: React.FC<LearningBoxProps> = ({ title, children }) => {
    return (
        <div className="learning-box">
            <div className="learning-box-title">
                <LightbulbIcon className="w-6 h-6" />
                <h4>{title}</h4>
            </div>
            <div className="learning-box-content">
                {children}
            </div>
        </div>
    );
};

export default LearningBox;