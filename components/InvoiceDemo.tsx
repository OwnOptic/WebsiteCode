import React, { useState } from 'react';
import { useI18n } from '../i18n/useI18n';
import { GoogleGenAI, Type } from '@google/genai';
import * as analytics from '../analytics';

const sampleInvoiceUrl = 'https://i.ibb.co/GJRq0v6/sample-invoice.png';

async function urlToGenerativePart(url: string, mimeType: string) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    return {
        inlineData: {
            data: base64,
            mimeType
        }
    };
}

const InvoiceDemo: React.FC = () => {
    const { t } = useI18n();
    const [isLoading, setIsLoading] = useState(false);
    const [extractedData, setExtractedData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const processInvoice = async () => {
        setIsLoading(true);
        setExtractedData(null);
        setError(null);
        analytics.trackEvent('process_invoice_demo_click', {});

        try {
            const apiKey = process.env.API_KEY;
            if (!apiKey) {
                throw new Error("API_KEY is not configured.");
            }
            const ai = new GoogleGenAI({ apiKey });

            const imagePart = await urlToGenerativePart(sampleInvoiceUrl, 'image/png');
            const textPart = { text: "Extract the vendor name, invoice ID, total amount, and all line items (including description, quantity, unit price, and total) from this invoice. Respond in JSON format." };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts: [imagePart, textPart] },
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            vendorName: { type: Type.STRING },
                            invoiceId: { type: Type.STRING },
                            totalAmount: { type: Type.NUMBER },
                            lineItems: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        description: { type: Type.STRING },
                                        quantity: { type: Type.INTEGER },
                                        unitPrice: { type: Type.NUMBER },
                                        total: { type: Type.NUMBER },
                                    },
                                     required: ['description', 'quantity', 'unitPrice', 'total']
                                },
                            },
                        },
                        required: ['vendorName', 'invoiceId', 'totalAmount', 'lineItems']
                    },
                },
            });
            
            const resultText = response.text.trim();
            const resultJson = JSON.parse(resultText);
            setExtractedData(resultJson);
             analytics.trackEvent('process_invoice_demo_success', {});

        } catch (err) {
            console.error("Error processing invoice with Gemini:", err);
            setError("Failed to process the invoice. Please try again later.");
             analytics.trackEvent('process_invoice_demo_error', { error_message: (err as Error).message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-8 border-t border-gray-200 pt-8">
            <h4 className="font-semibold text-xl text-[var(--primary-text)] mb-2">{t('useCases.modal.interactiveDemoTitle')}</h4>
            <div className="grid md:grid-cols-2 gap-6 items-start">
                <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-[var(--primary-text)] mb-2">{t('invoiceDemo.sampleInvoiceLabel')}</label>
                        <img src={sampleInvoiceUrl} alt="Sample invoice" className="rounded-lg border border-gray-200 w-full" loading="lazy" width="600" height="746" />
                    </div>
                    <button 
                        onClick={processInvoice} 
                        disabled={isLoading}
                        className="w-full bg-[var(--interactive-blue)] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[var(--interactive-hover)] disabled:bg-gray-400 transition-colors flex items-center justify-center"
                    >
                         {isLoading && (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {isLoading ? t('invoiceDemo.processing') : t('invoiceDemo.processButton')}
                    </button>
                </div>
                <div className="bg-[var(--surface-background)] p-4 rounded-lg min-h-[200px]">
                    <h5 className="font-semibold text-[var(--primary-text)] mb-2">{t('invoiceDemo.extractedDataTitle')}</h5>
                    {isLoading && <p className="text-sm text-[var(--secondary-text)]">Analyzing invoice...</p>}
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    {extractedData && (
                        <pre className="text-sm text-gray-800 bg-white p-3 rounded overflow-auto font-mono max-h-96">{JSON.stringify(extractedData, null, 2)}</pre>
                    )}
                     {!isLoading && !extractedData && !error && (
                         <p className="text-sm text-[var(--secondary-text)]">JSON output will appear here.</p>
                     )}
                </div>
            </div>
        </div>
    );
};

export default InvoiceDemo;