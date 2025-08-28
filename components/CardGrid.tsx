import React from 'react';
import { Card, CardProps } from './Card';
import '../styles/CardGrid.css';

interface CardGridProps {
    title?: string;
    cards: CardProps[];
}

const CardGrid: React.FC<CardGridProps> = ({ title, cards }) => {
    return (
        <section className="card-grid-section">
            {title && (
                <>
                    <h2 className="card-grid-title">{title}</h2>
                    <div className="card-grid-divider"></div>
                </>
            )}
            <div className="card-grid">
                {cards.map((card, index) => (
                    <div key={index} className={card.layout === 'large' ? 'grid-item-large' : ''}>
                        <Card {...card} />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CardGrid;