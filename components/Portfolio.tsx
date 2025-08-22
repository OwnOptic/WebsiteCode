import React from 'react';
import { useI18n } from '../i18n/useI18n';

interface PortfolioItemProps {
    imgSrc: string;
    title: string;
    category: string;
}

const PortfolioItem: React.FC<PortfolioItemProps> = ({ imgSrc, title, category }) => (
    <div className="group relative overflow-hidden rounded-lg custom-shadow cursor-pointer">
        <img src={imgSrc} alt={title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-500 flex items-center justify-center">
            <div className="text-center text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
                <h4 className="text-[1.563rem] font-semibold leading-[1.4]">{title}</h4>
                <p className="text-sm text-gray-200">{category}</p>
            </div>
        </div>
    </div>
);


const Portfolio: React.FC = () => {
    const { t } = useI18n();
    const portfolioData = t('portfolio.items');

    return (
        <section className="bg-white">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-[2.441rem] font-bold text-[var(--primary-text)] mb-2 leading-[1.2]">{t('portfolio.title')}</h2>
                 <p className="text-[var(--secondary-text)] mb-2">{t('portfolio.subtitle')}</p>
                 <div className="w-24 h-1 bg-[var(--interactive-blue)] mx-auto mb-12"></div>
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {portfolioData.map((item: PortfolioItemProps, index: number) => (
                         <PortfolioItem key={index} {...item} />
                     ))}
                 </div>
            </div>
        </section>
    );
};

export default Portfolio;