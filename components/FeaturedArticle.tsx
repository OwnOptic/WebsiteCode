import React from 'react';

interface FeaturedArticleProps {
    variant: 'sidebar-right' | 'image-right';
    mainContent: {
        category?: string;
        title: string;
        text: string;
        imageUrl?: string;
        link?: {
            text: string;
            href: string;
        }
    };
    sidebarContent?: {
        title: string;
        text: string;
    };
}

const FeaturedArticle: React.FC<FeaturedArticleProps> = ({ variant, mainContent, sidebarContent }) => {

    const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        window.location.hash = href;
    };

    if (variant === 'sidebar-right') {
        return (
            <div className="featured-article-sidebar-grid">
                <div className="featured-article-main-content">
                    <div className="flex flex-col md:flex-row gap-8">
                        {mainContent.imageUrl && (
                            <div className="md:w-1/3">
                                <img src={mainContent.imageUrl} alt={mainContent.title} className="rounded-lg object-cover h-full w-full" />
                            </div>
                        )}
                        <div className="md:w-2/3">
                            {mainContent.category && <p className="text-sm font-semibold text-gray-500">{mainContent.category}</p>}
                            <h2 className="text-3xl font-bold text-gray-900 mt-1">{mainContent.title}</h2>
                            <p className="mt-4 text-gray-600">{mainContent.text}</p>
                            {mainContent.link && <a href={mainContent.link.href} onClick={(e) => handleNav(e, mainContent.link!.href)} className="featured-article-link">{mainContent.link.text} &rarr;</a>}
                        </div>
                    </div>
                </div>
                {sidebarContent && (
                    <div className="featured-article-sidebar">
                        <h3 className="text-xl font-bold">{sidebarContent.title}</h3>
                        <p className="mt-4 text-red-100">{sidebarContent.text}</p>
                    </div>
                )}
            </div>
        );
    }
    
    if (variant === 'image-right') {
        return (
            <div className="featured-article-image-right">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-2/3">
                        {mainContent.category && <p className="text-sm font-semibold text-gray-500">{mainContent.category}</p>}
                        <h2 className="text-3xl font-bold text-gray-900 mt-1">{mainContent.title}</h2>
                        <p className="mt-4 text-gray-600">{mainContent.text}</p>
                    </div>
                    <div className="md:w-1/3">
                        <img src={mainContent.imageUrl} alt={mainContent.title} className="rounded-lg object-cover h-full w-full" />
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default FeaturedArticle;
