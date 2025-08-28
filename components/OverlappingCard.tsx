import React from 'react';

interface OverlappingCardProps {
    variant: 'image-right' | 'image-left';
    imageUrl: string;
    title: string;
    text: string;
}

const OverlappingCard: React.FC<OverlappingCardProps> = ({ variant, imageUrl, title, text }) => {
    return (
        <div className="overlapping-card-wrapper">
            <div className="relative p-8 md:p-12">
                <div className={`overlapping-card-bg-image-wrapper ${variant}`}>
                    <img className="overlapping-card-bg-image" src={imageUrl} alt={title} loading="lazy" />
                </div>
                <div className={`overlapping-card-fg-box ${variant}`}>
                    <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
                    <p className="text-gray-600 mt-4 text-base leading-relaxed">{text}</p>
                </div>
            </div>
        </div>
    );
};

export default OverlappingCard;
