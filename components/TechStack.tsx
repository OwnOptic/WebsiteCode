import React from 'react';
import { useI18n } from '../i18n/useI18n';
import PlatformIcon from './icons/PlatformIcon';
import CloudIcon from './icons/CloudIcon';
import DevToolsIcon from './icons/DevToolsIcon';
import Breadcrumb from './Breadcrumb';
import type { BreadcrumbLink } from '../types';
import {
    CopilotStudioIcon,
    PowerAutomateIcon,
    PowerAppsIcon,
    AzureIcon,
    GeminiIcon,
    ReactIcon,
    SharePointIcon,
    GoogleCloudIcon,
    MicrosoftCopilotIcon,
    GitHubCopilotIcon,
    DataverseIcon,
    IndustryIcon,
    GithubIcon,
    VsCodeIcon,
    PostmanIcon,
    AiBuilderIcon,
    PowerFxIcon,
    PowerPlatformIcon,
    AiStudioIcon,
    CognitiveSearchIcon,
    TextTranslationIcon,
    AiAssistedCodingIcon
} from './index';
import '../styles/TechStack.css';

const categoryIconMap: { [key: string]: React.ReactNode } = {
    'PlatformIcon': <PlatformIcon className="w-8 h-8" />,
    'CloudIcon': <CloudIcon className="w-8 h-8" />,
    'DevToolsIcon': <DevToolsIcon className="w-8 h-8" />
};

const techIconMap: { [key: string]: React.ReactNode } = {
    'Microsoft Power Automate': <PowerAutomateIcon />,
    'Microsoft Copilot Studio': <CopilotStudioIcon />,
    'Microsoft Power Apps': <PowerAppsIcon />,
    'Microsoft SharePoint': <SharePointIcon />,
    'Dataverse': <DataverseIcon />,
    'Microsoft Azure AI': <AzureIcon />,
    'Google Cloud Platform': <GoogleCloudIcon />,
    'Google Gemini API': <GeminiIcon />,
    'Microsoft Copilot': <MicrosoftCopilotIcon />,
    'GitHub Copilot': <GitHubCopilotIcon />,
    'React & TypeScript': <ReactIcon />,
    'GitHub': <GithubIcon />,
    'VS Code': <VsCodeIcon />,
    'Postman': <PostmanIcon />,
    'Microsoft AI Builder': <AiBuilderIcon />,
    'Power Fx': <PowerFxIcon />,
    'Microsoft Power Platform': <PowerPlatformIcon />,
    'Azure AI Studio': <AiStudioIcon />,
    'Azure AI Search': <CognitiveSearchIcon />,
    'Azure AI Translator': <TextTranslationIcon />,
    'AI Assisted Coding': <AiAssistedCodingIcon />,
    'Codage Assisté par IA': <AiAssistedCodingIcon />
};

interface TechStackProps {
    breadcrumbs: BreadcrumbLink[];
}

const TechStack: React.FC<TechStackProps> = ({ breadcrumbs }) => {
    const { t } = useI18n();
    const headerData = t('techStack.header');
    const categories = t('techStack.categories') || [];

    const headerStyle = {
        backgroundImage: `url('${headerData.imageUrl}')`
    };

    return (
        <div className="tech-stack-page">
            <header className="tech-stack-header">
                <div className="tech-stack-header-bg" style={headerStyle}></div>
                <div className="tech-stack-header-content">
                    <h1>{headerData.title}</h1>
                    <p>{headerData.subtitle}</p>
                </div>
            </header>
            
            <main className="tech-stack-main-content">
                <Breadcrumb links={breadcrumbs} />
                <div className="tech-stack-categories-container">
                    {categories.map((category: any, index: number) => (
                        <section key={index}>
                            <div className="tech-stack-category-header">
                                <div className="tech-stack-category-icon">
                                    {categoryIconMap[category.icon]}
                                </div>
                                <h2>{category.title}</h2>
                            </div>
                            <div className="tech-stack-grid">
                                {category.items.map((item: any, itemIndex: number) => (
                                    <div key={itemIndex} className="tech-stack-card">
                                        <div className="tech-stack-card-header">
                                            {techIconMap[item.name] && (
                                                <div className="tech-stack-item-icon">
                                                    {techIconMap[item.name]}
                                                </div>
                                            )}
                                            <h3>{item.name}</h3>
                                        </div>
                                        <p>{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default TechStack;