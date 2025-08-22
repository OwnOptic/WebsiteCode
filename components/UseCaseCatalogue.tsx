

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useI18n } from '../i18n/useI18n';
import SearchIcon from './icons/SearchIcon';
import UseCaseDetail from './UseCaseDetail';
import * as analytics from '../analytics';

interface UseCase {
    id: number;
    title: string;
    industry: string;
    technology: string;
    miniDescription: string;
    technicalLevel: number;
    problem: string;
    value: string;
    roi: string;
    implementationGuide: string;
    [key: string]: any; // Allow for other properties
}

const UseCaseCatalogue: React.FC = () => {
    const { t } = useI18n();
    const useCasesData = (t('useCases.catalogue') || []) as UseCase[];

    const [currentIndustry, setCurrentIndustry] = useState('All Industries');
    const [currentTech, setCurrentTech] = useState('All Technologies');
    const [currentSearch, setCurrentSearch] = useState('');
    const [selectedUseCase, setSelectedUseCase] = useState<UseCase | null>(null);

    const triggerRef = useRef<HTMLElement | null>(null);
    const modalRef = useRef<HTMLDivElement | null>(null);

    const industries = useMemo(() => ['All Industries', ...Array.from(new Set(useCasesData.map(uc => uc.industry))).sort()], [useCasesData]);
    const technologies = ['All Technologies', 'Copilot Studio', 'Power Automate'];

    const industryColors: { [key: string]: string } = {
        'Financial Services & Banking': '#0052CC', 'Insurance': '#006644', 'Manufacturing': '#5E6C76',
        'Retail & Consumer Packaged Goods': '#D95319', 'Cross-Industry Solutions': '#6A737B', 'Pharmaceuticals': '#6A0DAD',
        'Public Sector': '#B8860B', 'Professional Services': '#00529B', 'Telecom': '#E30B5D',
        'Media & Entertainment': '#FF6347', 'Utilities': '#008B8B'
    };

    const techLogos: { [key: string]: string } = {
        'Copilot Studio': 'https://a.fsdn.com/allura/s/power-virtual-agents/icon?2870d8956e754b3cbe5f40fe2072d58e6cbcb872413cebf4b5b99e2d410f790a?&w=148',
        'Power Automate': 'https://www.rpatech.ai/wp-content/uploads/2024/10/Power-Automate.png'
    };

    const filteredCases = useMemo(() => {
        let cases = useCasesData;
        if (currentIndustry !== 'All Industries') {
            cases = cases.filter(uc => uc.industry === currentIndustry);
        }
        if (currentTech !== 'All Technologies') {
            cases = cases.filter(uc => uc.technology.includes(currentTech));
        }
        if (currentSearch) {
            const lowerCaseSearch = currentSearch.toLowerCase();
            cases = cases.filter(uc =>
                uc.title.toLowerCase().includes(lowerCaseSearch) ||
                uc.miniDescription.toLowerCase().includes(lowerCaseSearch)
            );
        }
        return cases;
    }, [useCasesData, currentIndustry, currentTech, currentSearch]);

    const handleUrlHash = () => {
        const hash = window.location.hash;
        
        const modalMatch = hash.match(/#uc(\d+)/);
        if (modalMatch && modalMatch[1]) {
            const id = parseInt(modalMatch[1], 10);
            const useCase = useCasesData.find(uc => uc.id === id);
            if (useCase) {
                openModal(useCase, false);
            }
        }

        const params = new URLSearchParams(hash.split('?')[1]);
        const industryParam = params.get('industry');
        const techParam = params.get('technology');

        if (industryParam && industries.includes(industryParam)) {
            setCurrentIndustry(industryParam);
        }
        if (techParam && technologies.includes(techParam)) {
            setCurrentTech(techParam);
        }
    };


    useEffect(() => {
        if (useCasesData.length > 0) {
            handleUrlHash();
        }
        
        const handleHashChange = () => {
             if (window.location.hash.startsWith('#/use-cases')) {
                 handleUrlHash();
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [useCasesData]);
    
    useEffect(() => {
        if (selectedUseCase && modalRef.current) {
            const focusableElements = modalRef.current.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0] as HTMLElement;
            firstElement?.focus();
        }
    }, [selectedUseCase]);

    const openModal = (uc: UseCase, track: boolean = true) => {
        triggerRef.current = document.activeElement as HTMLElement;
        setSelectedUseCase(uc);
        document.body.style.overflow = 'hidden';
        if (track) {
            analytics.trackEvent('view_use_case', {
                use_case_id: uc.id,
                use_case_title: uc.title,
            });
        }
        try {
            const paddedId = uc.id.toString().padStart(2, '0');
            const { hash } = window.location;
            
            const lastHashIndex = hash.lastIndexOf('#');
            const baseHash = (lastHashIndex > 0) ? hash.substring(0, lastHashIndex) : hash;
            
            const newHash = `${baseHash}#uc${paddedId}`;
            window.location.hash = newHash;
        } catch (e) {
            console.error("Could not set URL hash:", e);
        }
    };

    const closeModal = () => {
        setSelectedUseCase(null);
        document.body.style.overflow = '';
        triggerRef.current?.focus();
        try {
            const { hash } = window.location;
            const lastHashIndex = hash.lastIndexOf('#');
            if (lastHashIndex > 0) {
                const newHash = hash.substring(0, lastHashIndex);
                window.location.hash = newHash;
            }
        } catch (e) {
            console.error("Error clearing URL hash:", e);
        }
    };
    
    const industryCounts = useMemo(() => {
        const counts: { [key: string]: number } = {};
        useCasesData.forEach(uc => {
            counts[uc.industry] = (counts[uc.industry] || 0) + 1;
        });
        return counts;
    }, [useCasesData]);
    
    const techCounts = useMemo(() => {
        const counts: { [key: string]: number } = { 'All Technologies': useCasesData.length };
        technologies.slice(1).forEach(tech => {
            counts[tech] = useCasesData.filter(uc => uc.technology.includes(tech)).length;
        });
        return counts;
    }, [useCasesData]);

    const handleIndustryClick = (industry: string) => {
        setCurrentIndustry(industry);
        analytics.trackEvent('filter_use_case', {
            filter_type: 'industry',
            filter_value: industry
        });
    };

    const handleTechClick = (tech: string) => {
        setCurrentTech(tech);
        analytics.trackEvent('filter_use_case', {
            filter_type: 'technology',
            filter_value: tech
        });
    };

    const handleSearchChange = (value: string) => {
        setCurrentSearch(value);
        if (value.length > 2) {
            analytics.trackEvent('search_use_case', { search_term: value });
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="text-center mb-16">
                <h1 className="text-[2.441rem] font-bold text-[var(--primary-text)]">{t('useCases.header.title')}</h1>
                <p className="mt-4 text-lg text-[var(--secondary-text)] max-w-3xl mx-auto">{t('useCases.header.subtitle')}</p>
            </header>

            <main>
                <section className="mb-16">
                     <div className="bg-[var(--surface-background)] p-8 rounded-lg">
                        <h3 className="text-[1.953rem] font-semibold text-[var(--primary-text)] mb-4 text-center">{t('useCases.overview.distributionTitle')}</h3>
                        <p className="text-center text-[var(--secondary-text)] mb-8">{t('useCases.overview.distributionSubtitle')}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            <div 
                                className={`p-4 rounded-lg shadow-sm flex items-center cursor-pointer border-l-8 transition-all duration-200 ${currentIndustry === 'All Industries' ? 'shadow-lg -translate-y-1 ring-2 ring-[var(--interactive-blue)]' : 'hover:shadow-md hover:-translate-y-1'}`}
                                style={{ borderColor: 'var(--interactive-blue)' }}
                                onClick={() => handleIndustryClick('All Industries')}>
                                <div className="flex-grow">
                                    <p className="text-base font-semibold text-[var(--primary-text)]">{t('useCases.overview.allIndustries')}</p>
                                    <p className="text-3xl font-bold text-[var(--primary-text)] mt-1">{useCasesData.length}</p>
                                    <p className="text-xs text-[var(--secondary-text)]">{t('useCases.overview.totalUseCases')}</p>
                                </div>
                            </div>
                            {industries.slice(1).sort((a,b) => (industryCounts[b] || 0) - (industryCounts[a] || 0)).map(industry => (
                                <div 
                                    key={industry}
                                    className={`p-4 rounded-lg shadow-sm flex items-center cursor-pointer border-l-8 transition-all duration-200 ${currentIndustry === industry ? 'shadow-lg -translate-y-1 ring-2 ring-offset-2' : 'hover:shadow-md hover:-translate-y-1'}`}
                                    style={{
                                        borderColor: industryColors[industry] || '#5E6C76',
                                        '--tw-ring-color': industryColors[industry] || '#5E6C76'
                                    } as React.CSSProperties}
                                    onClick={() => handleIndustryClick(industry)}>
                                    <div className="flex-grow">
                                        <p className="text-base font-semibold text-[var(--primary-text)]">{industry}</p>
                                        <p className="text-3xl font-bold text-[var(--primary-text)] mt-1">{industryCounts[industry] || 0}</p>
                                        <p className="text-xs text-[var(--secondary-text)]">{t('useCases.filters.cases')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                
                <section>
                    <h2 className="text-[2.441rem] font-bold text-[var(--primary-text)] mb-2 text-center">{t('useCases.explorer.title')}</h2>
                    <p className="text-center text-[var(--secondary-text)] mb-10">{t('useCases.explorer.subtitle')}</p>

                    <div className="mb-10 bg-[var(--surface-background)] p-8 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 items-center">
                             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {technologies.map(tech => (
                                    <div key={tech} 
                                        onClick={() => handleTechClick(tech)}
                                        className={`bg-white p-3 rounded-lg shadow-sm flex items-center cursor-pointer border-2 transition-all duration-200 ${currentTech === tech ? 'border-[var(--interactive-blue)] shadow-md ring-2 ring-offset-1 ring-[var(--interactive-blue)]' : 'border-transparent hover:shadow-md hover:-translate-y-1'}`}>
                                        {techLogos[tech] && <img src={techLogos[tech]} className="w-6 h-6 mr-3" alt={`${tech} logo`}/>}
                                        <div className="flex-grow">
                                            <p className="text-sm font-semibold text-[var(--primary-text)]">{tech === 'All Technologies' ? t('useCases.filters.allTech') : tech}</p>
                                            <p className="text-xs text-[var(--secondary-text)]">{techCounts[tech]} {t('useCases.filters.cases')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="relative flex items-center">
                                <SearchIcon className="w-5 h-5 text-gray-400 absolute left-4" />
                                <input 
                                    type="text" 
                                    value={currentSearch}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    placeholder={t('useCases.explorer.searchPlaceholder')}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--interactive-blue)] focus:border-[var(--interactive-blue)] transition-shadow"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCases.map(uc => (
                            <button key={uc.id} onClick={() => openModal(uc)} 
                                className="bg-white border border-[var(--border-color)] rounded-lg shadow-sm p-6 cursor-pointer flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-2 text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--interactive-blue)]"
                                style={{ borderTop: `6px solid ${industryColors[uc.industry] || '#5E6C76'}` }}>
                                <div className="flex justify-between items-start mb-4">
                                    <p className="text-sm text-[var(--secondary-text)] font-semibold">{t('useCases.card.idPrefix')}{uc.id}</p>
                                    <div className="flex gap-2">
                                        {uc.technology.split(' & ').map(tech => (
                                            techLogos[tech.trim()] && <img src={techLogos[tech.trim()]} key={tech} alt={`${tech} logo`} className="w-5 h-5" title={tech}/>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex-grow">
                                    <h4 className="text-[1.25rem] font-semibold text-[var(--primary-text)] mb-2">{uc.title}</h4>
                                    <p className="text-sm text-[var(--secondary-text)] mt-2">{uc.miniDescription}</p>
                                </div>
                                <p className="text-sm text-[var(--secondary-text)] mt-4 pt-4 border-t border-gray-100 font-semibold">{uc.industry}</p>
                            </button>
                        ))}
                    </div>
                    {filteredCases.length === 0 && (
                        <div className="text-center py-16 text-[var(--secondary-text)]">
                            <p className="text-xl font-semibold">{t('useCases.explorer.noResultsTitle')}</p>
                            <p>{t('useCases.explorer.noResultsSubtitle')}</p>
                        </div>
                    )}
                </section>
            </main>

            {selectedUseCase && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 animate-fade-in" 
                    onClick={closeModal}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    <div 
                        ref={modalRef}
                        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-slide-in-up" 
                        onClick={e => e.stopPropagation()}
                        tabIndex={-1}
                    >
                       <UseCaseDetail useCase={selectedUseCase} closeModal={closeModal} />
                    </div>
                </div>
            )}
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slide-in-up {
                    from { transform: translateY(2rem); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
                 .animate-slide-in-up {
                    animation: slide-in-up 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default UseCaseCatalogue;