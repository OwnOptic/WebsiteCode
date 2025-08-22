
import React, { useState } from 'react';
import { useI18n } from '../i18n/useI18n';
import InvoiceDemo from './InvoiceDemo';
import * as analytics from '../analytics';

interface UseCase {
    id: number;
    title: string;
    industry: string;
    technicalLevel: number;
    problem: string;
    value: string;
    roi: string;
    implementationGuide: string;
    [key: string]: any;
}

interface UseCaseDetailProps {
    useCase: UseCase;
    closeModal: () => void;
}

const UseCaseDetail: React.FC<UseCaseDetailProps> = ({ useCase, closeModal }) => {
    const { t } = useI18n();
    const [copySuccess, setCopySuccess] = useState('');

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
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center z-10">
                <h3 id="modal-title" className="text-xl md:text-2xl font-bold text-[var(--primary-text)] pr-4">{useCase.title}</h3>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
            </div>
            <div className="p-6 md:p-8 overflow-y-auto">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                    <span className="bg-gray-100 text-[var(--secondary-text)] text-sm font-medium px-3 py-1 rounded-full">{useCase.industry}</span>
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">{t('useCases.modal.technicalLevel')}: {useCase.technicalLevel}/10</span>
                </div>
                <div className="space-y-8">
                    <div>
                        <h4 className="font-semibold text-xl text-[var(--primary-text)] mb-2">{t('useCases.modal.problemTitle')}</h4>
                        <p className="text-[var(--secondary-text)] leading-relaxed">{useCase.problem}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-xl text-[var(--primary-text)] mb-2">{t('useCases.modal.valueTitle')}</h4>
                        <div className="text-[var(--secondary-text)] leading-relaxed" dangerouslySetInnerHTML={{ __html: useCase.value }}></div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-xl text-[var(--primary-text)] mb-2">{t('useCases.modal.roiTitle')}</h4>
                        <div 
                            className="bg-[var(--surface-background)] p-4 rounded-lg text-sm text-[var(--secondary-text)] overflow-x-auto whitespace-pre-wrap"
                            dangerouslySetInnerHTML={{ __html: useCase.roi.replace(/<code>/g, '<code class="block bg-gray-200 text-gray-800 p-3 rounded my-2 font-mono text-xs">').replace(/<\/code>/g, '</code>') }}
                        ></div>
                    </div>

                    {useCase.id === 21 && <InvoiceDemo />}
                    
                    {useCase.implementationGuide && (
                        <div className="mt-8">
                            <details className="border border-gray-200 rounded-lg">
                                <summary className="font-semibold text-lg text-[var(--primary-text)] p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center">
                                    {t('useCases.modal.pocTitle')}
                                    <svg className="w-5 h-5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </summary>
                                <div className="p-4 border-t border-gray-200 prose max-w-none" dangerouslySetInnerHTML={{ __html: useCase.implementationGuide }}></div>
                            </details>
                        </div>
                    )}
                </div>
            </div>
            <div className="sticky bottom-0 bg-gray-50 p-4 border-t border-gray-200 flex justify-end">
                <button 
                    onClick={() => shareUseCase(useCase.id)} 
                    className="bg-[var(--interactive-blue)] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[var(--interactive-hover)] transition-colors flex items-center"
                >
                    {copySuccess || t('useCases.modal.share')}
                </button>
            </div>
             <style>{`
                .prose h5 {
                    font-weight: 600;
                    font-size: 1.125rem;
                    margin-top: 1.5rem;
                    margin-bottom: 0.5rem;
                    color: var(--primary-text);
                }
                .prose p, .prose li {
                     color: var(--secondary-text);
                }
                .prose ol, .prose ul {
                    margin-left: 1rem;
                }
                .prose strong {
                    color: var(--primary-text);
                }
                details > summary { list-style: none; }
                details > summary::-webkit-details-marker { display: none; }
                details[open] summary svg { transform: rotate(180deg); }
            `}</style>
        </>
    );
};

export default UseCaseDetail;
