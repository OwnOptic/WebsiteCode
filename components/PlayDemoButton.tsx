import React from 'react';
import '../styles/PlayDemoButton.css';

const PlayDemoButton = ({ children, onClick, variant = 'default' }: { children: React.ReactNode, onClick?: () => void, variant?: 'small' | 'default' | 'large' }) => {
  return (
    <button className={`play-demo-button ${variant}`} onClick={onClick}>
      <span className="shine-effect"></span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="play-icon"
      >
        <polygon points="7 4 7 20 17 12" />
      </svg>
      {children}
    </button>
  );
};

export default PlayDemoButton;
