import React, { useState } from 'react';
import '../styles/FaqAccordion.css';

interface FaqItem {
    question: string;
    answer: string;
}

interface FaqAccordionProps {
    items: FaqItem[];
}

const FaqAccordion: React.FC<FaqAccordionProps> = ({ items = [] }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="faq-accordion-wrapper">
            {items.map((item, index) => (
                <div key={index} className="faq-item">
                    <button
                        type="button"
                        className={`faq-question ${openIndex === index ? 'open' : ''}`}
                        onClick={() => toggleFaq(index)}
                        aria-expanded={openIndex === index}
                        aria-controls={`faq-answer-${index}`}
                    >
                        <span className="faq-question-text">{item.question}</span>
                        <svg className="faq-chevron" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <div
                        id={`faq-answer-${index}`}
                        className={`faq-answer ${openIndex === index ? 'open' : ''}`}
                    >
                        <div className="faq-answer-content" dangerouslySetInnerHTML={{ __html: item.answer }}>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FaqAccordion;