import React from 'react';

const CloudIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.375a9.737 9.737 0 0 0 7.331-3.412c.394-.456.326-1.12-.138-1.428a8.954 8.954 0 0 1-1.302-.916 9.737 9.737 0 0 0-11.784 0 8.955 8.955 0 0 1-1.302.916c-.464.308-.532.972-.138 1.428A9.737 9.737 0 0 0 12 18.375Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75h.008v.008H12v-.008Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75h.008v.008H12v-.008Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 13.5h.008v.008H16.5v-.008Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 13.5h.008v.008H7.5v-.008Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9h.008v.008h-.008V9Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9h.008v.008H9.75V9Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.375a9.71 9.71 0 0 1 4.5 1.102 8.955 8.955 0 0 0-1.302.916 9.737 9.737 0 0 1-11.784 0 8.955 8.955 0 0 0-1.302-.916A9.71 9.71 0 0 1 12 3.375Z" />
  </svg>
);

export default CloudIcon;