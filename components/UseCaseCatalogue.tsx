import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useI18n } from '../i18n/useI18n';
import SearchIcon from './icons/SearchIcon';
import UseCaseDetail from './UseCaseDetail';
import * as analytics from '../analytics';
import Breadcrumb from './Breadcrumb';
import type { BreadcrumbLink } from '../types';
import '../styles/UseCaseCatalogue.css';

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

interface UseCaseCatalogueProps {
    breadcrumbs: BreadcrumbLink[];
}

const UseCaseCatalogue: React.FC<UseCaseCatalogueProps> = ({ breadcrumbs }) => {
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
        <div className="use-case-catalogue">
            <Breadcrumb links={breadcrumbs} />
            <header className="catalogue-header">
                <h1>{t('useCases.header.title')}</h1>
                <p>{t('useCases.header.subtitle')}</p>
            </header>

            <main>
                <section className="catalogue-overview-section">
                     <div className="catalogue-overview-container">
                        <h3>{t('useCases.overview.distributionTitle')}</h3>
                        <p>{t('useCases.overview.distributionSubtitle')}</p>
                        <div className="industry-cards-grid">
                            <button 
                                className={`industry-card ${currentIndustry === 'All Industries' ? 'active' : ''}`}
                                style={{ borderColor: 'var(--interactive-blue)' }}
                                onClick={() => handleIndustryClick('All Industries')}>
                                <div className="industry-card-content">
                                    <p className="industry-card-name">{t('useCases.overview.allIndustries')}</p>
                                    <p className="industry-card-count">{useCasesData.length}</p>
                                    <p className="industry-card-label">{t('useCases.overview.totalUseCases')}</p>
                                </div>
                            </button>
                            {industries.slice(1).sort((a,b) => (industryCounts[b] || 0) - (industryCounts[a] || 0)).map(industry => (
                                <button
                                    key={industry}
                                    className={`industry-card ${currentIndustry === industry ? 'active' : ''}`}
                                    style={{
                                        borderColor: industryColors[industry] || '#5E6C76',
                                        '--active-ring-color': industryColors[industry] || '#5E6C76'
                                    } as React.CSSProperties}
                                    onClick={() => handleIndustryClick(industry)}>
                                    <div className="industry-card-content">
                                        <p className="industry-card-name">{industry}</p>
                                        <p className="industry-card-count">{industryCounts[industry] || 0}</p>
                                        <p className="industry-card-label">{t('useCases.filters.cases')}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
                
                <section>
                    <h2 className="catalogue-explorer-title">{t('useCases.explorer.title')}</h2>
                    <p className="catalogue-explorer-subtitle">{t('useCases.explorer.subtitle')}</p>

                    <div className="catalogue-filters-container">
                        <div className="catalogue-filters-grid">
                             <div className="tech-filters-grid">
                                {technologies.map(tech => (
                                    <button
                                        key={tech} 
                                        onClick={() => handleTechClick(tech)}
                                        className={`tech-filter-card ${currentTech === tech ? 'active' : ''}`}>
                                        {techLogos[tech] && <img src={techLogos[tech]} className="tech-filter-logo" alt={`${tech} logo`}/>}
                                        <div className="tech-filter-content">
                                            <p className="tech-filter-name">{tech === 'All Technologies' ? t('useCases.filters.allTech') : tech}</p>
                                            <p className="tech-filter-count">{techCounts[tech]} {t('useCases.filters.cases')}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <div className="search-input-wrapper">
                                <SearchIcon className="search-input-icon" />
                                <input 
                                    type="text" 
                                    value={currentSearch}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    placeholder={t('useCases.explorer.searchPlaceholder')}
                                    className="search-input"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="use-case-grid">
                        {filteredCases.map(uc => (
                            <button key={uc.id} onClick={() => openModal(uc)} 
                                className="use-case-card"
                                style={{ borderTop: `6px solid ${industryColors[uc.industry] || '#5E6C76'}` }}>
                                <div className="use-case-card-header">
                                    <p>{t('useCases.card.idPrefix')}{uc.id.toString().padStart(2, '0')}</p>
                                    <div className="use-case-card-logos">
                                        {uc.technology.split(' & ').map(tech => (
                                            techLogos[tech.trim()] && <img src={techLogos[tech.trim()]} key={tech} alt={`${tech} logo`} title={tech}/>
                                        ))}
                                    </div>
                                </div>
                                <div className="use-case-card-body">
                                    <h4>{uc.title}</h4>
                                    <p>{uc.miniDescription}</p>
                                </div>
                                <p className="use-case-card-footer">{uc.industry}</p>
                            </button>
                        ))}
                    </div>
                    {filteredCases.length === 0 && (
                        <div className="catalogue-no-results">
                            <p>{t('useCases.explorer.noResultsTitle')}</p>
                            <p>{t('useCases.explorer.noResultsSubtitle')}</p>
                        </div>
                    )}
                </section>
            </main>

            {selectedUseCase && (
                <div 
                    className="modal-overlay animate-fade-in" 
                    onClick={closeModal}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    <div 
                        ref={modalRef}
                        className="modal-container animate-slide-in-up" 
                        onClick={e => e.stopPropagation()}
                        tabIndex={-1}
                    >
                       <UseCaseDetail useCase={selectedUseCase} closeModal={closeModal} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default UseCaseCatalogue;