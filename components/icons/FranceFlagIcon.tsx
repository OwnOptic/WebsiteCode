import React from 'react';

const FranceFlagIcon: React.FC<{ className?: string; title?: string }> = ({ className, title }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" className={className}>
        {title && <title>{title}</title>}
        <rect width="1" height="2" fill="#0055A4"/>
        <rect width="1" height="2" x="1" fill="#FFFFFF"/>
        <rect width="1" height="2" x="2" fill="#EF4135"/>
    </svg>
);

export default FranceFlagIcon;