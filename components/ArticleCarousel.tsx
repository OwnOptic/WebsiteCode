import React, { useRef, useState, useEffect } from 'react';
import { useI18n } from '../i18n/useI18n';
import { Card } from './Card';
import '../styles/ArticleCarousel.css';

interface ArticleCarouselProps {
    title: string;
    itemSlugs: string[];
}

const ArticleCarousel: React.FC<ArticleCarouselProps> = ({ title, itemSlugs }) => {
    const { t } = useI18n();
    const allProjects = t('projects.items') || [];
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);

    const items = itemSlugs.map(slug => allProjects.find((p: any) => p.slug === slug)).filter(Boolean);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setIsAtStart(scrollLeft < 10);
            setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 10);
        }
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            // Initial check in case content is not wide enough to scroll
            handleScroll();
            container.addEventListener('scroll', handleScroll, { passive: true });
            
            // Re-check on window resize
            window.addEventListener('resize', handleScroll);

            return () => {
                container.removeEventListener('scroll', handleScroll);
                window.removeEventListener('resize', handleScroll);
            };
        }
    }, [items]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = (scrollContainerRef.current.querySelector('.scroll-item')?.clientWidth || 280) + 24; // Card width + gap
            scrollContainerRef.current.scrollBy({ 
                left: direction === 'left' ? -scrollAmount : scrollAmount, 
                behavior: 'smooth' 
            });
        }
    };

    return (
        <div className="article-carousel-wrapper">
            <div className="article-carousel-header">
                <h2 className="article-carousel-title">{title}</h2>
                <div className="article-carousel-controls">
                    <button onClick={() => scroll('left')} className="carousel-btn" aria-label="Previous article" disabled={isAtStart}>
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <button onClick={() => scroll('right')} className="carousel-btn" aria-label="Next article" disabled={isAtEnd}>
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                </div>
            </div>
            <div className="scroll-container-wrapper">
                <div ref={scrollContainerRef} className="scroll-container">
                    {items.map((item: any, index: number) => (
                        <div key={index} className="scroll-item">
                           <Card 
                               variant="carousel"
                               imageUrl={item.imgSrc}
                               title={item.title}
                               link={item.link}
                           />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ArticleCarousel;