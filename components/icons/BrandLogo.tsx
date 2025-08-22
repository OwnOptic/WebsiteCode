import React from 'react';

const BrandLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 110 100" className={className} xmlns="http://www.w3.org/2000/svg" aria-label="Elliot Margot Logo">
    <title>Elliot Margot Logo</title>
    <g>
        <path d="M15 15H30V85H15z M15 15H50V30H15z M15 42.5H45V57.5H15z M15 70H50V85H15z" fill="#F26F21"/>
        <path d="M55 85V15L75 50L95 15V85" stroke="#2A3B4E" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </g>
  </svg>
);

export default BrandLogo;
