import React from 'react';
import '../styles/ClientTestimonial.css';

interface ClientTestimonialProps {
    text: string;
    authorName: string;
    authorTitle: string;
    authorImageUrl: string;
}

const ClientTestimonial: React.FC<ClientTestimonialProps> = ({ text, authorName, authorTitle, authorImageUrl }) => (
    <div className="testimonial-box">
        <svg className="testimonial-quote-bg" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 3a1 1 0 01.866.502l.498.865a1 1 0 00.866.502h1.002a1 1 0 01.866.502l.498.865a1 1 0 00.866.502h.002a1 1 0 01.866.502l.498.865a1 1 0 00.866.502h.002a1 1 0 010 2h-.002a1 1 0 00-.866.502l-.498.865a1 1 0 01-.866.502h-.002a1 1 0 00-.866.502l-.498.865a1 1 0 01-.866.502h-1.002a1 1 0 00-.866.502l-.498.865a1 1 0 01-.866.502H10a1 1 0 01-.866-.502l-.498-.865a1 1 0 00-.866-.502h-1.002a1 1 0 01-.866-.502l-.498-.865a1 1 0 00-.866-.502h-.002a1 1 0 01-.866-.502l-.498-.865a1 1 0 00-.866-.502h-.002a1 1 0 010-2h.002a1 1 0 00.866.502l.498.865a1 1 0 01.866.502h.002a1 1 0 00.866.502l.498.865a1 1 0 01.866.502h1.002a1 1 0 00.866.502l.498.865A1 1 0 0110 3z" clipRule="evenodd"></path></svg>
        <p className="testimonial-text">"{text}"</p>
        <div className="testimonial-author-info">
            <img className="testimonial-avatar" src={authorImageUrl} alt={authorName} />
            <div className="testimonial-author-details">
                <p className="testimonial-author-name">{authorName}</p>
                <p className="testimonial-author-title">{authorTitle}</p>
            </div>
        </div>
    </div>
);

export default ClientTestimonial;