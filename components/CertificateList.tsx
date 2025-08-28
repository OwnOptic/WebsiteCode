import React, { useState } from 'react';
import AwardIcon from './icons/AwardIcon';
import '../styles/CertificateList.css';

interface CertificateItem {
  name: string;
  level: string;
  url: string;
}

interface CertificateCategory {
  category: string;
  items: CertificateItem[];
}

interface CertificateListProps {
  categories: CertificateCategory[];
}

const getLevelClass = (level: string) => {
    const lowerLevel = level.toLowerCase();
    if (lowerLevel.includes('advanced') || lowerLevel.includes('avancé')) return 'level-advanced';
    if (lowerLevel.includes('intermediate') || lowerLevel.includes('intermédiaire')) return 'level-intermediate';
    if (lowerLevel.includes('fundamentals') || lowerLevel.includes('fondamentaux')) return 'level-fundamentals';
    if (lowerLevel.includes('community') || lowerLevel.includes('communauté')) return 'level-community';
    return 'level-beginner';
};


const CertificateList: React.FC<CertificateListProps> = ({ categories }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleCategory = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="certificate-list-container">
            {categories.map((category, index) => (
                <div key={index} className="certificate-category-item">
                    <button
                        className={`certificate-category-header ${openIndex === index ? 'open' : ''}`}
                        onClick={() => toggleCategory(index)}
                        aria-expanded={openIndex === index}
                        aria-controls={`category-content-${index}`}
                    >
                        <span className="category-header-text">{category.category}</span>
                        <svg className="category-chevron" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <div
                        id={`category-content-${index}`}
                        className={`certificate-grid-wrapper ${openIndex === index ? 'open' : ''}`}
                    >
                        <div className="certificate-grid">
                            {category.items.map((cert, certIndex) => (
                                <a href={cert.url} key={certIndex} target="_blank" rel="noopener noreferrer" className="certificate-card">
                                    <div className="certificate-card-content">
                                        <AwardIcon className="certificate-icon" />
                                        <h4 className="certificate-name">{cert.name}</h4>
                                        <span className={`certificate-level-badge ${getLevelClass(cert.level)}`}>{cert.level}</span>
                                    </div>
                                    <div className="certificate-card-footer">
                                        <span className="certificate-verify-button">Verify</span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CertificateList;