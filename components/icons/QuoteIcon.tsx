import React from 'react';

const QuoteIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className={className}>
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 9.983-9.57v7.203c-3.731 0-5.352 2.571-5.352 6.192v3.566h-4.631zm-14.017 0v-7.391c0-5.704 3.748-9.57 9.983-9.57v7.203c-3.731 0-5.368 2.571-5.368 6.192v3.566h-4.615z"/>
    </svg>
);

export default QuoteIcon;
