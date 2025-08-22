import React, { useState } from 'react';
import { useI18n } from '../i18n/useI18n';
import * as analytics from '../analytics';

const Contact: React.FC = () => {
    const { t } = useI18n();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name || !email || !message) {
            setStatus(t('contact.status.error'));
            setTimeout(() => setStatus(''), 3000);
            return;
        }
        
        setIsLoading(true);
        setStatus(t('contact.status.sending'));
        analytics.trackEvent('contact_form_submit', {});

        // This URL is a placeholder. Replace with your actual serverless function endpoint.
        const endpoint = 'https://europe-west1-portfolio-contact-form-428615.cloudfunctions.net/sendEmailFunction';

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, message }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            setStatus(t('contact.status.success'));
            analytics.trackEvent('contact_form_success', {});
            setName('');
            setEmail('');
            setMessage('');
            setTimeout(() => setStatus(''), 5000);

        } catch (error) {
            console.error("Error sending message:", error);
            setStatus(t('contact.status.apiError'));
            analytics.trackEvent('contact_form_error', { error_message: (error as Error).message });
            setTimeout(() => setStatus(''), 5000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="bg-[var(--surface-background)]">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-[2.441rem] font-bold text-[var(--primary-text)] mb-2 leading-[1.2]">{t('contact.title')}</h2>
                    <p className="text-[var(--secondary-text)] text-lg max-w-2xl mx-auto">{t('contact.subtitle')}</p>
                    <div className="w-24 h-1 bg-[var(--interactive-blue)] mx-auto mt-4"></div>
                </div>
                <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-lg custom-shadow">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="sr-only">{t('contact.form.name')}</label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder={t('contact.form.name')}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--interactive-blue)] transition-shadow"
                                    aria-label={t('contact.form.name')}
                                    disabled={isLoading}
                                />
                            </div>
                             <div>
                                <label htmlFor="email" className="sr-only">{t('contact.form.email')}</label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder={t('contact.form.email')}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--interactive-blue)] transition-shadow"
                                    aria-label={t('contact.form.email')}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="message" className="sr-only">{t('contact.form.message')}</label>
                            <textarea
                                id="message"
                                placeholder={t('contact.form.message')}
                                rows={6}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--interactive-blue)] transition-shadow"
                                aria-label={t('contact.form.message')}
                                disabled={isLoading}
                            ></textarea>
                        </div>
                        <div className="text-center">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-[var(--interactive-blue)] text-white text-lg font-semibold py-3 px-8 rounded-lg hover:bg-[var(--interactive-hover)] transition-all duration-200 transform hover:scale-105 disabled:bg-gray-400 disabled:scale-100 flex items-center justify-center w-full md:w-auto mx-auto"
                            >
                                {isLoading && (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                {isLoading ? status : t('contact.form.submit')}
                            </button>
                        </div>
                        {status && !isLoading && <p className="text-center mt-4 text-[var(--secondary-text)]" role="status">{status}</p>}
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;