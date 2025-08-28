import React from 'react';
import PlayDemoButton from './PlayDemoButton';
import '../styles/DemoCard.css';

interface DemoCardProps {
    description: string;
    buttonText: string;
    buttonVariant?: 'small' | 'default' | 'large';
    onClick?: () => void;
    variant?: 'default' | 'compact' | 'highlight' | 'futuristic';
}

const DemoCard: React.FC<DemoCardProps> = ({ description, buttonText, buttonVariant = 'default', onClick, variant = 'default' }) => {
  return (
    <div className={`demo-card-wrapper ${variant}`}>
      <div className="background-glow"></div>
      <div className={`demo-card-content ${variant}`}>
        <p className={`demo-card-description ${variant}`}>
          {description}
        </p>
        <PlayDemoButton variant={buttonVariant} onClick={onClick}>
          {buttonText}
        </PlayDemoButton>
        <p className="demo-card-instruction">
          Click to launch the full interactive experience!
        </p>
      </div>
    </div>
  );
};

export default DemoCard;
