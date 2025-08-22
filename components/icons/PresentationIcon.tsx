import React from 'react';

const PresentationIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125V6.375m1.125 13.125A1.125 1.125 0 004.5 18.375h15A1.125 1.125 0 0020.625 19.5m-17.25 0h17.25M12 12.75a.75.75 0 000-1.5.75.75 0 000 1.5zM12 15a.75.75 0 000-1.5.75.75 0 000 1.5zM12 17.25a.75.75 0 000-1.5.75.75 0 000 1.5zM4.5 4.5h15a2.25 2.25 0 012.25 2.25v6.75a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75A2.25 2.25 0 014.5 4.5zM12 4.5v.75" />
  </svg>
);

export default PresentationIcon;