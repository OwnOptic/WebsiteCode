import React from 'react';
import '../styles/MythVsFact.css';

interface MythVsFactProps {
    myth: string;
    fact: string;
}

const MythVsFact: React.FC<MythVsFactProps> = ({ myth, fact }) => (
    <div className="myth-fact-box">
        <div className="myth-box">
            <h4 className="myth-fact-header myth-header">Myth</h4>
            <p className="myth-fact-text myth-text">{myth}</p>
        </div>
        <div className="fact-box">
            <h4 className="myth-fact-header fact-header">Fact</h4>
            <p className="myth-fact-text fact-text">{fact}</p>
        </div>
    </div>
);

export default MythVsFact;