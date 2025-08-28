import React, { useEffect } from 'react';
import XMarkIcon from './icons/XMarkIcon';
import '../styles/GameModal.css';

interface GameModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const GameModal: React.FC<GameModalProps> = ({ onClose, children }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div 
      className="game-modal-overlay" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="game-modal-content" 
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="game-modal-close-button" 
          aria-label="Close game"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        <div className="game-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default GameModal;
