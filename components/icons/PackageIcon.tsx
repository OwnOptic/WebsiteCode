import React from 'react';

const PackageIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="m3.27 6.96 8.73 5.05L20.73 6.96" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 22.08V12" />
  </svg>
);

export default PackageIcon;