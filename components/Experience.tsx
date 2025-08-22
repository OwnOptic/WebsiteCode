import React, { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/useI18n';
import PackageIcon from './icons/PackageIcon';

const Experience: React.FC = () => {
    const { t } = useI18n();
    const experienceData = t('experience.timeline') || [];
    const headerData = t('experience.header');
    
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

        const elements = timelineRef.current?.querySelectorAll('.experience-block');
        if (elements) {
            elements.forEach(el => observer.observe(el));
        }
        
        return () => {
            if (elements) {
                elements.forEach(el => observer.unobserve(el));
            }
        };
    }, [experienceData]);

    const headerStyle = {
        backgroundImage: `url('https://raw.githubusercontent.com/OwnOptic/Website-storage/main/Gemini_Generated_Image_xar87axar87axar8.png')`
    };

    return (
        <div>
            <style>
            {`
            .experience-block {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.6s ease-out, transform 0.6s ease-out;
            }
            .experience-block.visible {
                opacity: 1;
                transform: translateY(0);
            }
            .experience-block li::before {
                content: '→';
                position: absolute;
                left: 0;
                top: 1px;
                color: var(--interactive-blue);
                font-weight: 700;
                transition: transform 0.3s ease-out;
            }
            .experience-block .group:hover li::before {
                transform: translateX(4px);
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
                <div ref={timelineRef} className="relative before:content-[''] before:absolute before:left-[28px] before:top-0 before:bottom-0 before:w-1 before:bg-[var(--surface-background)] before:rounded-full">
                    {experienceData.map((item: any, index: number) => (
                        <div 
                            key={index} 
                            data-index={index}
                            className={`experience-block relative mb-12 ${visibleItems.has(index) ? 'visible' : ''}`} 
                            style={{ transitionDelay: `${index * 150}ms` }}>
                            <div className="absolute left-0 top-8 h-14 w-14 bg-white border-4 border-[var(--surface-background)] rounded-full flex items-center justify-center z-10 group-hover:border-[var(--interactive-blue)] transition-colors duration-300">
                               <PackageIcon className="w-7 h-7 text-[var(--secondary-text)] group-hover:text-[var(--interactive-blue)] transition-colors duration-300" />
                            </div>
                            <div className="ml-24 group">
                                <div className="p-8 bg-white border border-[var(--border-color)] rounded-lg custom-shadow hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                                    <h3 className="text-2xl md:text-3xl font-semibold text-[var(--primary-text)] mb-1">{item.role}</h3>
                                    <h4 className="text-lg text-[var(--secondary-text)] mb-4">{item.company} | {item.period}</h4>
                                    <ul className="list-none p-0 m-0 space-y-3">
                                        {item.points.map((point: string, pIndex: number) => (
                                            <li key={pIndex} className="relative pl-7 text-[var(--secondary-text)] leading-relaxed">{point}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Experience;