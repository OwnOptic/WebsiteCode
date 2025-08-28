import React from 'react';
import '../styles/ImageComponent.css';

interface ImageItem {
    src: string;
    alt: string;
}

interface ImageComponentProps {
    variant: 'simple-caption' | 'decorative-frame' | 'polaroid' | 'gallery-grid';
    src?: string;
    alt?: string;
    caption?: string;
    images?: ImageItem[];
}

const ImageComponent: React.FC<ImageComponentProps> = ({ variant, src, alt, caption, images }) => {
    switch (variant) {
        case 'simple-caption':
            return (
                <figure className="image-caption-wrapper">
                    {src && alt && <img src={src} alt={alt} loading="lazy" />}
                    {caption && <figcaption className="image-caption-text">{caption}</figcaption>}
                </figure>
            );
        
        case 'decorative-frame':
            return (
                <div className="image-decorative-frame-wrapper">
                    <div className="image-decorative-frame-bg"></div>
                    {src && alt && <img className="image-decorative-frame-img" src={src} alt={alt} loading="lazy" />}
                </div>
            );
            
        case 'polaroid':
            return (
                <div className="image-polaroid-wrapper">
                    {src && alt && <img src={src} alt={alt} loading="lazy" />}
                    {caption && <p className="image-polaroid-text">{caption}</p>}
                </div>
            );

        case 'gallery-grid':
            return (
                <div className="image-gallery-grid">
                    {(images || []).map((image, index) => (
                        <div key={index} className="image-gallery-item">
                            <img src={image.src} alt={image.alt} loading="lazy" />
                        </div>
                    ))}
                </div>
            );
            
        default:
            return null;
    }
};

export default ImageComponent;