import React, { useState } from 'react';
import { useI18n } from '../i18n/useI18n';
import * as analytics from '../analytics';

interface Subscriber {
    id: string;
    name: string;
    tier: 'Premium' | 'Standard';
    lastActive: string;
    churnRisk: 'Low' | 'High';
    reason?: string;
}

const ChurnPredictionDemo: React.FC = () => {
    const { t } = useI18n();

    const initialSubscribers: Subscriber[] = [
        { id: 'SUB-001', name: 'Alice Johnson', tier: 'Premium', lastActive: '2 days ago', churnRisk: 'Low' },
        { id: 'SUB-002', name: 'Bob Williams', tier: 'Standard', lastActive: '35 days ago', churnRisk: 'Low' },
        { id: 'SUB-003', name: 'Charlie Brown', tier: 'Premium', lastActive: '1 day ago', churnRisk: 'Low' },
        { id: 'SUB-004', name: 'Diana Miller', tier: 'Premium', lastActive: '5 days ago', churnRisk: 'Low' },
        { id: 'SUB-005', name: 'Ethan Davis', tier: 'Standard', lastActive: '42 days ago', churnRisk: 'Low' },
    ];

    const [subscribers, setSubscribers] = useState<Subscriber[]>(initialSubscribers);
    const [isLoading, setIsLoading] = useState(false);
    const [isAnalyzed, setIsAnalyzed] = useState(false);

    const handleRunPrediction = () => {
        setIsLoading(true);
        setIsAnalyzed(false);
        analytics.trackEvent('run_churn_prediction_demo', {});

        setTimeout(() => {
            setSubscribers(prev =>
                prev.map(sub => {
                    if (sub.id === 'SUB-002') {
                        return { ...sub, churnRisk: 'High', reason: t('churnPredictionDemo.reasons.reason1') };
                    }
                    if (sub.id === 'SUB-005') {
                        return { ...sub, churnRisk: 'High', reason: t('churnPredictionDemo.reasons.reason2') };
                    }
                    return sub;
                })
            );
            setIsLoading(false);
            setIsAnalyzed(true);
        }, 1500);
    };

    const RiskBadge: React.FC<{ risk: 'Low' | 'High' }> = ({ risk }) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            risk === 'High' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
            {risk === 'High' ? t('churnPredictionDemo.status.high') : t('churnPredictionDemo.status.low')}
        </span>
    );

    return (
        <div className="space-y-4">
            <p className="text-sm text-[var(--secondary-text)]">{t('churnPredictionDemo.description')}</p>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-[var(--primary-text)] mb-3">{t('churnPredictionDemo.subscribersTitle')}</h4>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-4 py-3">{t('churnPredictionDemo.table.id')}</th>
                                <th scope="col" className="px-4 py-3">{t('churnPredictionDemo.table.name')}</th>
                                <th scope="col" className="px-4 py-3">{t('churnPredictionDemo.table.tier')}</th>
                                <th scope="col" className="px-4 py-3">{t('churnPredictionDemo.table.lastActive')}</th>
                                <th scope="col" className="px-4 py-3">{t('churnPredictionDemo.table.risk')}</th>
                                {isAnalyzed && <th scope="col" className="px-4 py-3">{t('churnPredictionDemo.table.reason')}</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {subscribers.map(sub => (
                                <tr key={sub.id} className={`border-b ${sub.churnRisk === 'High' ? 'bg-red-50' : 'bg-white'}`}>
                                    <td className="px-4 py-3 font-mono text-gray-800">{sub.id}</td>
                                    <td className="px-4 py-3 text-gray-800 font-medium">{sub.name}</td>
                                    <td className="px-4 py-3">{sub.tier}</td>
                                    <td className="px-4 py-3">{sub.lastActive}</td>
                                    <td className="px-4 py-3"><RiskBadge risk={sub.churnRisk} /></td>
                                    {isAnalyzed && <td className="px-4 py-3 italic text-red-900">{sub.reason || 'N/A'}</td>}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <button 
                onClick={handleRunPrediction} 
                disabled={isLoading || isAnalyzed}
                className="w-full bg-[var(--interactive-blue)] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[var(--interactive-hover)] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
                 {isLoading && (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                )}
                {isLoading ? t('churnPredictionDemo.runningButton') : (isAnalyzed ? t('churnPredictionDemo.analyzedButton') : t('churnPredictionDemo.runButton'))}
            </button>
        </div>
    );
};

export default ChurnPredictionDemo;