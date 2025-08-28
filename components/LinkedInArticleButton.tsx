import React from 'react';
import LinkedinIcon from './icons/LinkedinIcon';
import '../styles/LinkedInArticleButton.css';

interface LinkedInArticleButtonProps {
    text: string;
    href: string;
}

const LinkedInArticleButton: React.FC<LinkedInArticleButtonProps> = ({ text, href }) => {
    return (
        <div className="linkedin-button-container">
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="linkedin-article-button"
            >
                <LinkedinIcon className="linkedin-button-icon" />
                <span>{text}</span>
            </a>
        </div>
    );
};

export default LinkedInArticleButton;