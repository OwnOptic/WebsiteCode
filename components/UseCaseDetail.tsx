import React, { useState } from 'react';
import { useI18n } from '../i18n/useI18n';
import InvoiceDemo from './InvoiceDemo';
import ConflictCheckDemo from './ConflictCheckDemo';
import ChurnPredictionDemo from './ChurnPredictionDemo';
import * as analytics from '../analytics';
import '../styles/UseCaseDetail.css';

interface UseCase {
    id: number;
    title: string;
    industry: string;
    technicalLevel: number;
    problem: string;
    value: string;
    roi: string;
    implementationGuide: string;
    interactiveComponent?: string; // Add optional property for the demo component
    [key: string]: any;
}

interface UseCaseDetailProps {
    useCase: UseCase;
    closeModal: () => void;
}

// Map of component names to their actual React components
const interactiveComponentMap: { [key: string]: React.FC } = {
    InvoiceDemo,
    ConflictCheckDemo,
    ChurnPredictionDemo,
};

const UseCaseDetail: React.FC<UseCaseDetailProps> = ({ useCase, closeModal }) => {
    const { t } = useI18n();
    const [copySuccess, setCopySuccess] = useState('');

    const InteractiveComponent = useCase.interactiveComponent 
        ? interactiveComponentMap[useCase.interactiveComponent] 
        : null;

    const shareUseCase = (id: number) => {
        const paddedId = id.toString().padStart(2, '0');
        const url = `${window.location.origin}${window.location.pathname}#/use-cases#uc${paddedId}`;
        
        navigator.clipboard.writeText(url).then(() => {
            setCopySuccess(t('useCases.modal.linkCopied'));
            analytics.trackEvent('share_use_case', {
                use_case_id: id,
                use_case_title: useCase.title
            });
            setTimeout(() => setCopySuccess(''), 2000);
        }, (err) => {
            console.error('Could not copy text: ', err);
        });
    };

    return (
        <>
            <header className="use-case-modal-header">
                <h3 id="modal-title">{useCase.title}</h3>
                <button onClick={closeModal} aria-label="Close modal">&times;</button>
            </header>
            <main className="use-case-modal-content">
                <div className="use-case-modal-metadata">
                    <span className="metadata-pill industry">{useCase.industry}</span>
                     {useCase.technicalLevel && (
                        <span className="metadata-pill tech-level">{t('useCases.modal.technicalLevel')}: {useCase.technicalLevel}/10</span>
                    )}
                </div>
                <div className="use-case-modal-sections">
                     {useCase.problem && (
                        <section>
                            <h4>{t('useCases.modal.problemTitle')}</h4>
                            <p>{useCase.problem}</p>
                        </section>
                    )}
                    {useCase.value && (
                        <section>
                            <h4>{t('useCases.modal.valueTitle')}</h4>
                            <div dangerouslySetInnerHTML={{ __html: useCase.value }}></div>
                        </section>
                    )}
                    {useCase.roi && (
                         <section>
                            <h4>{t('useCases.modal.roiTitle')}</h4>
                            <div 
                                className="roi-corner"
                                dangerouslySetInnerHTML={{ __html: useCase.roi }}
                            ></div>
                        </section>
                    )}

                    {InteractiveComponent && (
                        <div className="interactive-demo-container">
                            <InteractiveComponent />
                        </div>
                    )}
                    
                    {useCase.implementationGuide && (
                        <div className="implementation-guide-container">
                            <details className="implementation-guide-details">
                                <summary>
                                    {t('useCases.modal.pocTitle')}
                                    <svg className="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </summary>
                                <div className="implementation-guide-content prose" dangerouslySetInnerHTML={{ __html: useCase.implementationGuide }}></div>
                            </details>
                        </div>
                    )}
                </div>
            </main>
            <footer className="use-case-modal-footer">
                <button 
                    onClick={() => shareUseCase(useCase.id)} 
                    className="share-button"
                >
                    {copySuccess || t('useCases.modal.share')}
                </button>
            </footer>
        </>
    );
};

export default UseCaseDetail;