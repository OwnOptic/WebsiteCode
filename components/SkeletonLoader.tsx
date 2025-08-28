import React from 'react';
import '../styles/SkeletonLoader.css';

const SkeletonLoader: React.FC = () => {
    return (
        <div className="skeleton-container">
            {/* Skeleton Header */}
            <header className="skeleton-header">
                <div className="skeleton-header-content">
                    <div className="skeleton-pulse skeleton-logo"></div>
                    <div className="skeleton-desktop-nav">
                        <div className="skeleton-pulse skeleton-nav-item"></div>
                        <div className="skeleton-pulse skeleton-nav-item wide"></div>
                        <div className="skeleton-pulse skeleton-nav-item"></div>
                        <div className="skeleton-pulse skeleton-nav-button"></div>
                    </div>
                    <div className="skeleton-mobile-nav"></div>
                </div>
            </header>

            {/* Skeleton Main Content */}
            <main className="skeleton-main">
                <div className="skeleton-main-content">
                    <div className="skeleton-pulse skeleton-hero"></div>
                    <div className="skeleton-content-block">
                        <div className="skeleton-pulse skeleton-line long"></div>
                        <div className="skeleton-pulse skeleton-line medium"></div>
                        <div className="skeleton-pulse skeleton-line full"></div>
                        <div className="skeleton-pulse skeleton-line long"></div>
                    </div>
                </div>
            </main>

            {/* Skeleton Footer */}
            <footer className="skeleton-footer">
                <div className="skeleton-footer-content">
                    <div className="skeleton-footer-info">
                        <div className="skeleton-pulse skeleton-footer-title"></div>
                        <div className="skeleton-pulse skeleton-footer-subtitle"></div>
                    </div>
                    <div className="skeleton-pulse skeleton-footer-button"></div>
                </div>
            </footer>
        </div>
    );
};

export default SkeletonLoader;