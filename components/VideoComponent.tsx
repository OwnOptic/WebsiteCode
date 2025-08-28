import React, { useState, useEffect } from 'react';
import XMarkIcon from './icons/XMarkIcon';
import PlayIcon from './icons/PlayIcon';
import '../styles/VideoComponent.css';

interface VideoComponentProps {
    variant: 'simple-embed' | 'with-title' | 'hero' | 'modal-popup';
    videoUrl: string;
    title?: string;
    description?: string;
    buttonText?: string;
    buttonHref?: string;
    thumbnailUrl?: string;
}

const VideoComponent: React.FC<VideoComponentProps> = (props) => {
    const { variant, videoUrl, title, description, buttonText, buttonHref, thumbnailUrl } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsModalOpen(false);
        };
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isModalOpen]);
    
    const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        window.location.hash = href;
    };

    switch (variant) {
        case 'simple-embed':
            return (
                <div className="video-simple-embed">
                    <iframe src={videoUrl} title={title || 'Embedded Video'} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                </div>
            );

        case 'with-title':
            return (
                <div className="video-with-title">
                    <div className="video-with-title-embed-wrapper">
                        <iframe src={videoUrl} title={title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    </div>
                    {(title || description) && (
                        <div className="video-with-title-text-wrapper">
                            {title && <h3 className="video-with-title-title">{title}</h3>}
                            {description && <p className="video-with-title-description">{description}</p>}
                        </div>
                    )}
                </div>
            );

        case 'hero':
            return (
                <div className="video-hero">
                    <video autoPlay loop muted className="video-hero-video">
                        <source src={videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    <div className="video-hero-overlay"></div>
                    <div className="video-hero-content">
                        {title && <h1 className="video-hero-title">{title}</h1>}
                        {description && <p className="video-hero-text">{description}</p>}
                        {buttonText && buttonHref && (
                            <a href={buttonHref} onClick={(e) => handleNav(e, buttonHref)} className="video-hero-button">
                                {buttonText}
                            </a>
                        )}
                    </div>
                </div>
            );
            
        case 'modal-popup':
            return (
                <>
                    {thumbnailUrl && (
                        <button onClick={() => setIsModalOpen(true)} className="video-modal-thumbnail" aria-label={`Play video: ${title}`}>
                            <img src={thumbnailUrl} alt={title || 'Video thumbnail'} />
                            <div className="video-modal-thumbnail-overlay"></div>
                            <div className="video-modal-play-icon-container">
                                <div className="video-modal-play-icon-wrapper">
                                    <PlayIcon className="video-modal-play-icon" />
                                </div>
                            </div>
                        </button>
                    )}

                    {isModalOpen && (
                         <div className={`video-modal ${isModalOpen ? 'open' : ''}`} onClick={() => setIsModalOpen(false)}>
                            <div className="video-modal-content" onClick={e => e.stopPropagation()}>
                                <div className="video-modal-iframe-wrapper">
                                    <iframe src={`${videoUrl}${videoUrl.includes('?') ? '&' : '?'}autoplay=1`} title={title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="video-modal-close-button" aria-label="Close video">
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            );

        default:
            return null;
    }
};

export default VideoComponent;