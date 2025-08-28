import React from 'react';
import '../styles/TextImage.css';

interface TextImageProps {
    imagePosition: 'left' | 'right';
    category?: string;
    title: string;
    text: string[];
    imageUrl: string;
    button?: {
        text: string;
        href: string;
    }
}

const TextImage: React.FC<TextImageProps> = (props) => {
    const { imagePosition, category, title, text, imageUrl, button } = props;
    
    const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        window.location.hash = href;
    };

    return (
        <section className="text-image-section">
            <div className={`text-image-container ${imagePosition === 'left' ? 'image-left' : 'image-right'}`}>
                <div className="text-image-image-column">
                    <img className="text-image-image" src={imageUrl} alt={title} loading="lazy" />
                </div>
                <div className="text-image-content-column">
                    <div className="text-image-content-wrapper">
                        {category && <p className="text-image-category">{category}</p>}
                        <h2 className="text-image-title">{title}</h2>
                        {text.map((p, i) => <p key={i} className="text-image-paragraph">{p}</p>)}
                        {button && (
                            <a href={button.href} onClick={(e) => handleNav(e, button.href)} className="text-image-button">
                                {button.text} &rarr;
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TextImage;