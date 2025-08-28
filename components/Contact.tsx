import React, { useState } from 'react';
import { useI18n } from '../i18n/useI18n';
import * as analytics from '../analytics';
import Breadcrumb from './Breadcrumb';
import type { BreadcrumbLink } from '../types';
import '../styles/Contact.css';

interface ContactProps {
    breadcrumbs: BreadcrumbLink[];
}

const Contact: React.FC<ContactProps> = ({ breadcrumbs }) => {
    const { t } = useI18n();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name || !email || !message) {
            alert(t('contact.status.error'));
            return;
        }
        
        analytics.trackEvent('contact_form_submit', {});

        const subject = encodeURIComponent(`Contact Form Submission from ${name}`);
        const body = encodeURIComponent(
`You have a new message from your portfolio contact form:

Name: ${name}
Email: ${email}

Message:
${message}`
        );
        
        window.location.href = `mailto:elliottus12@gmail.com?subject=${subject}&body=${body}`;
    };

    return (
        <section className="contact-section">
            <div className="contact-container">
                <Breadcrumb links={breadcrumbs} />
                <div className="contact-header">
                    <h2 className="contact-title">{t('contact.title')}</h2>
                    <p className="contact-subtitle">{t('contact.subtitle')}</p>
                    <div className="contact-divider"></div>
                </div>
                <div className="contact-form-wrapper">
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="contact-form-grid">
                            <div>
                                <label htmlFor="name" className="sr-only">{t('contact.form.name')}</label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder={t('contact.form.name')}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="contact-input"
                                    aria-label={t('contact.form.name')}
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
                                    className="contact-input"
                                    aria-label={t('contact.form.email')}
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
                                className="contact-textarea"
                                aria-label={t('contact.form.message')}
                            ></textarea>
                        </div>
                        <div className="contact-submit-wrapper">
                            <button
                                type="submit"
                                className="contact-submit-button"
                            >
                                {t('contact.form.submit')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;