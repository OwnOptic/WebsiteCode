import React, { useEffect, useRef, useState } from 'react';

// Helper to create URL-friendly slugs
const toSlug = (text: string) => {
  return text.toLowerCase()
    .replace(/ & /g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};


const ProjectDetailLayout: React.FC<{ project: any }> = ({ project }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    
    // Ensure project and its properties exist
    if (!project || !project.overview || !project.contentSections) {
        return null; // or render a loading/error state
    }

    const { title, subtitle, heroImageUrl, overview, contentSections } = project;
    
    const overviewItems = [
        { label: 'Industry', value: overview.industry },
        { label: 'Timeline', value: overview.timeline },
        { label: 'Tech Stack', value: overview.techStack }
    ];

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <header className="relative h-[50vh] min-h-[400px] flex items-center justify-center text-center text-white">
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${heroImageUrl}')` }}
                >
                    <div className="absolute inset-0 bg-black opacity-60"></div>
                </div>
                <div className="relative z-10 p-4 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold leading-tight">{title}</h1>
                    <p className="mt-4 text-lg md:text-xl text-gray-200">{subtitle}</p>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div ref={contentRef}>
                     {/* Overview Card */}
                    <div className="bg-[var(--surface-background)] p-6 rounded-lg border border-[var(--border-color)] mb-12">
                        <h3 className="text-xl font-semibold text-[var(--primary-text)] mb-4 border-b pb-3">Project Overview</h3>
                        <ul className="space-y-3 text-sm">
                            {overviewItems.map(item => (
                                <li key={item.label} className="flex justify-between items-center py-1">
                                    <span className="font-semibold text-[var(--primary-text)]">{item.label}</span>
                                    <span className="text-[var(--secondary-text)] text-right">{item.value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <article className="prose lg:prose-lg max-w-none">
                         <style>
                            {`
                            .prose h2, .prose h3 {
                                color: var(--primary-text);
                                margin-bottom: 1em;
                                margin-top: 2.5em;
                                scroll-margin-top: 120px;
                            }
                             .prose h2:first-of-type {
                                margin-top: 0;
                            }
                            .prose p, .prose li {
                                color: var(--secondary-text);
                                line-height: 1.7;
                            }
                            .prose img {
                                margin-top: 2em;
                                margin-bottom: 2em;
                                border-radius: 0.5rem;
                                box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
                            }
                            .prose iframe {
                                width: 100%;
                                aspect-ratio: 16 / 9;
                                border-radius: 0.5rem;
                                box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
                            }
                            `}
                        </style>
                        {contentSections.map((section: any, index: number) => {
                            const sectionId = toSlug(section.title);
                            return (
                                <section key={index} id={sectionId}>
                                    <h2>{section.title}</h2>
                                    <div dangerouslySetInnerHTML={{ __html: section.htmlContent }}></div>
                                </section>
                            );
                        })}
                    </article>
                </div>
            </main>
        </div>
    );
};

export default ProjectDetailLayout;