import React, { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/useI18n';
import AwardIcon from './icons/AwardIcon';

const Certificates: React.FC = () => {
    const { t } = useI18n();
    const certificatesData = t('certificates.timeline') || [];
    const headerData = t('certificates.header');
    
    const timelineRef = useRef<HTMLDivElement>(null);
    const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = parseInt(entry.target.getAttribute('data-index') || '0', 10);
                        setVisibleItems(prev => new Set(prev).add(index));
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        const elements = timelineRef.current?.querySelectorAll('.category-block');
        if (elements) {
            elements.forEach(el => observer.observe(el));
        }
        
        return () => {
            if (elements) {
                elements.forEach(el => observer.unobserve(el));
            }
        };
    }, [certificatesData]);

    const headerStyle = {
        backgroundImage: `url('https://raw.githubusercontent.com/OwnOptic/Website-storage/main/Gemini_Generated_Image_5at9q35at9q35at9.png')`
    };

    return (
        <div>
            <style>
            {`
            .category-block {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.6s ease-out, transform 0.6s ease-out;
            }
            .category-block.visible {
                opacity: 1;
                transform: translateY(0);
            }
            details > summary {
                list-style: none;
            }
            details > summary::-webkit-details-marker {
                display: none;
            }
            .summary-arrow {
                transition: transform 0.3s ease-out;
            }
            details[open] > summary .summary-arrow {
                transform: rotate(90deg);
            }
            details[open] .icon-wrapper {
                 border-color: var(--interactive-blue);
            }
            details[open] .category-icon {
                 stroke: var(--interactive-blue);
            }
            `}
            </style>
            <header className="relative h-[45vh] min-h-[350px] flex items-center justify-center text-center text-white">
                <div className="absolute inset-0 bg-cover bg-center brightness-50" style={headerStyle}></div>
                <div className="relative z-10 p-4">
                    <h1 className="text-4xl md:text-6xl font-bold">{headerData.title}</h1>
                    <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-gray-200">{headerData.subtitle}</p>
                </div>
            </header>
            
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div ref={timelineRef} className="relative before:content-[''] before:absolute before:left-[34px] before:top-0 before:bottom-0 before:w-1 before:bg-[var(--surface-background)] before:rounded-full">
                    {certificatesData.map((category: any, index: number) => (
                        <div 
                            key={index} 
                            data-index={index}
                            className={`category-block relative mb-8 pl-24 ${visibleItems.has(index) ? 'visible' : ''}`} 
                            style={{ transitionDelay: `${index * 150}ms` }}>
                            
                           <details open={index === 0} className="group">
                                <summary className="relative cursor-pointer">
                                    <div className="absolute -left-24 top-0 h-16 w-16 bg-white border-4 border-[var(--surface-background)] rounded-full flex items-center justify-center z-10 transition-colors duration-300 icon-wrapper">
                                       <AwardIcon className="w-8 h-8 text-[var(--secondary-text)] transition-colors duration-300 category-icon" />
                                    </div>
                                    <div className="border border-[var(--border-color)] rounded-lg custom-shadow group-hover:shadow-xl transition-shadow duration-300 bg-white">
                                        <div className="p-6 flex justify-between items-center">
                                            <h3 className="text-xl md:text-2xl font-semibold text-[var(--primary-text)]">{category.category}</h3>
                                            <svg className="summary-arrow w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                        </div>
                                    </div>
                                </summary>
                                <div className="mt-2 p-6 bg-white border border-[var(--border-color)] rounded-lg custom-shadow">
                                    <ul className="list-none p-0 m-0 space-y-4">
                                        {category.items.map((item: any, itemIndex: number) => (
                                            <li key={itemIndex} className="text-[var(--secondary-text)] leading-relaxed border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                                                <strong className="block text-[var(--primary-text)] font-semibold">{item.name}</strong>
                                                <span className="text-sm">({item.level}) - </span>
                                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[var(--interactive-blue)] hover:underline font-semibold text-sm">Verify</a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </details>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Certificates;