import React, { useState } from 'react';
import type { BreadcrumbLink } from '../types';
import Breadcrumb from './Breadcrumb';
import AIDinoGame from './AIDinoGame';
import ConflictCheckDemo from './ConflictCheckDemo';
import DungeonExplorer from './DungeonExplorer';
import GameModal from './GameModal';
import InvoiceDemo from './InvoiceDemo';
import LearningBox from './LearningBox';
import CodeBlock from './CodeBlock';
import KeyStatBox from './KeyStatBox';
import QuoteBox from './QuoteBox';
import FeatureComparisonTable from './FeatureComparisonTable';
import FaqAccordion from './FaqAccordion';
import ProcessSteps from './ProcessSteps';
import AuthorBio from './AuthorBio';
import ClientTestimonial from './ClientTestimonial';
import MythVsFact from './MythVsFact';
import TechnologySpotlight from './TechnologySpotlight';
import KeyStatBlock from './KeyStatBlock';
import ProTip from './ProTip';
import WarningBox from './WarningBox';
import ArticleCarousel from './ArticleCarousel';
import { Card } from './Card';
import CardGrid from './CardGrid';
import FeaturedArticle from './FeaturedArticle';
import IconFeatureList from './IconFeatureList';
import OverlappingCard from './OverlappingCard';
import TextImage from './TextImage';
import ImageComponent from './ImageComponent';
import VideoComponent from './VideoComponent';
import GitHubRepoCard from './GitHubRepoCard';
import HeroV2 from './HeroV2';
import DemoCard from './DemoCard';
import PillBreadcrumb from './PillBreadcrumb';
import LinkedInArticleButton from './LinkedInArticleButton';
import IndustryIcon from './icons/IndustryIcon';
import TimelineIcon from './icons/TimelineIcon';
import TechStackIcon from './icons/TechStackIcon';
import '../styles/BlogTheme.css';
import '../styles/Demos.css';

// Map of interactive component names to their actual React components
const interactiveComponentMap: { [key: string]: React.FC } = {
    AIDinoGame,
    InvoiceDemo,
    ConflictCheckDemo,
    DungeonExplorer,
};

// Map of content block types to their renderer components
const contentComponentMap: { [key: string]: React.FC<any> } = {
    'heading': ({ level, text, key }) => {
        const Tag = `h${level}` as keyof JSX.IntrinsicElements;
        return <Tag key={key}>{text}</Tag>;
    },
    'html': ({ value, key }) => <div key={key} dangerouslySetInnerHTML={{ __html: value }} />,
    'code': ({ language, code, theme, key }) => <CodeBlock key={key} language={language} code={code} theme={theme} />,
    'learning-box': ({ title, content, key }) => (
        <LearningBox key={key} title={title}>
            <div dangerouslySetInnerHTML={{ __html: content }} />
        </LearningBox>
    ),
    'key-stat': ({ value, label, key }) => <KeyStatBox key={key} value={value} label={label} />,
    'quote': ({ text, author, source, key }) => <QuoteBox key={key} text={text} author={author} source={source} />,
    'demo-button': ({ onClick, key }) => (
        <div className="demo-button-container">
            <button onClick={onClick} className="demo-launcher-button" key={key}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>
                Launch Interactive Demo
            </button>
        </div>
    ),
    'feature-comparison-table': (props) => <FeatureComparisonTable {...props} />,
    'faq-accordion': (props) => <FaqAccordion {...props} />,
    'process-steps': (props) => <ProcessSteps {...props} />,
    'author-bio': (props) => <AuthorBio {...props} />,
    'client-testimonial': (props) => <ClientTestimonial {...props} />,
    'myth-vs-fact': (props) => <MythVsFact {...props} />,
    'technology-spotlight': (props) => <TechnologySpotlight {...props} />,
    'key-stat-block': (props) => <KeyStatBlock {...props} />,
    'pro-tip': (props) => <ProTip {...props} />,
    'warning-box': (props) => <WarningBox {...props} />,
    'article-carousel': (props) => <ArticleCarousel {...props} />,
    'card': (props) => <Card {...props} />,
    'card-grid': (props) => <CardGrid {...props} />,
    'featured-article': (props) => <FeaturedArticle {...props} />,
    'icon-feature-list': (props) => <IconFeatureList {...props} />,
    'overlapping-card': (props) => <OverlappingCard {...props} />,
    'text-image': (props) => <TextImage {...props} />,
    'image': (props) => <div className="component-wrapper"><ImageComponent {...props} /></div>,
    'video': (props) => <div className="component-wrapper"><VideoComponent {...props} /></div>,
    'hero-v2': (props) => <HeroV2 {...props} />,
    'demo-card': (props) => <div className="component-wrapper"><DemoCard {...props} /></div>,
    'pill-breadcrumb': (props) => <PillBreadcrumb {...props} />,
    'linkedin-article-button': (props) => <LinkedInArticleButton {...props} />,
    'github-repo': (props) => <div className="my-8 max-w-md mx-auto"><GitHubRepoCard {...props} /></div>,
};

interface ProjectDetailLayoutProps {
    project: any;
    breadcrumbs: BreadcrumbLink[];
    children?: React.ReactNode;
}

const ProjectDetailLayout: React.FC<ProjectDetailLayoutProps> = ({ project, breadcrumbs, children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!project) {
        return null;
    }

    const { title, subtitle, heroImageUrl, overview, content, interactiveComponent } = project;
    const InteractiveComponent = interactiveComponent ? interactiveComponentMap[interactiveComponent] : null;

    const overviewItems = overview ? [
        { label: 'Industry', value: overview.industry, icon: <IndustryIcon className="w-6 h-6" /> },
        { label: 'Timeline', value: overview.timeline, icon: <TimelineIcon className="w-6 h-6" /> },
        { label: 'Tech Stack', value: overview.techStack, icon: <TechStackIcon className="w-6 h-6" /> }
    ] : [];

    const renderContentBlock = (block: any, index: number) => {
        const Component = contentComponentMap[block.type];
        if (!Component) return null;

        const props = {
            ...block,
            key: index,
            onClick: block.type === 'demo-button' && InteractiveComponent ? () => setIsModalOpen(true) : undefined,
        };
        
        return <Component {...props} />;
    };

    return (
        <>
            <div className="blog-theme">
                <header className="project-header">
                    <div 
                        className="project-header-bg"
                        style={{ backgroundImage: `url('${heroImageUrl}')` }}
                    >
                        <div className="project-header-overlay"></div>
                    </div>
                    <div className="project-header-content">
                        <h1>{title}</h1>
                        <p>{subtitle}</p>
                    </div>
                </header>

                <article className="project-article-container">
                    <Breadcrumb links={breadcrumbs} />

                    {overview && (
                        <section className="project-metadata">
                            {overviewItems.map((item) => (
                                <div key={item.label} className="metadata-item">
                                    <div className="metadata-icon">{item.icon}</div>
                                    <div>
                                        <h4 className="metadata-label">{item.label}</h4>
                                        <p className="metadata-value">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </section>
                    )}
                    
                    <div className="prose">
                        {children || (content && content.map((block: any, index: number) => renderContentBlock(block, index)))}
                    </div>
                </article>
            </div>
            {isModalOpen && InteractiveComponent && (
                <GameModal onClose={() => setIsModalOpen(false)}>
                    <InteractiveComponent />
                </GameModal>
            )}
        </>
    );
};

export default ProjectDetailLayout;