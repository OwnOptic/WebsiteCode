import React from 'react';
import { useI18n } from '../i18n/useI18n';
import '../styles/Portfolio.css';

interface PortfolioItemProps {
    imgSrc: string;
    title: string;
    category: string;
}

const PortfolioItem: React.FC<PortfolioItemProps> = ({ imgSrc, title, category }) => (
    <div className="portfolio-item">
        <img src={imgSrc} alt={title} className="portfolio-item-image" />
        <div className="portfolio-item-overlay">
            <div className="portfolio-item-text-content">
                <h4 className="portfolio-item-title">{title}</h4>
                <p className="portfolio-item-category">{category}</p>
            </div>
        </div>
    </div>
);


const Portfolio: React.FC = () => {
    const { t } = useI18n();
    const portfolioData = t('portfolio.items');

    return (
        <section className="portfolio-section">
            <div className="portfolio-container">
                <h2 className="portfolio-title">{t('portfolio.title')}</h2>
                 <p className="portfolio-subtitle">{t('portfolio.subtitle')}</p>
                 <div className="portfolio-divider"></div>
                 <div className="portfolio-grid">
                     {portfolioData.map((item: PortfolioItemProps, index: number) => (
                         <PortfolioItem key={index} {...item} />
                     ))}
                 </div>
            </div>
        </section>
    );
};

export default Portfolio;