import React from 'react';
import {
    AiBuilderIcon,
    AiStudioIcon,
    AzureIcon,
    CodeIcon,
    CopilotStudioIcon,
    DataverseIcon,
    GeminiIcon,
    GoogleCloudIcon,
    PowerAppsIcon,
    PowerAutomateIcon,
    PowerFxIcon,
    PowerPlatformIcon,
    ReactIcon,
    // Fix: Changed from GitHubIcon to GithubIcon to match the export from './index'.
    GithubIcon,
    VsCodeIcon,
    PostmanIcon,
    MicrosoftCopilotIcon,
    CognitiveSearchIcon,
    TextTranslationIcon,
    AiAssistedCodingIcon,
    GitHubCopilotIcon
} from './index';
import '../styles/TechnologySpotlight.css';

const iconMap: { [key: string]: React.ReactNode } = {
    'Microsoft Power Platform': <PowerPlatformIcon />,
    'Microsoft Copilot Studio': <CopilotStudioIcon />,
    'Microsoft AI Builder': <AiBuilderIcon />,
    'Microsoft Power Automate': <PowerAutomateIcon />,
    'Microsoft Power Apps': <PowerAppsIcon />,
    'Dataverse': <DataverseIcon />,
    'Azure AI Studio': <AiStudioIcon />,
    'Azure AI Search': <CognitiveSearchIcon />,
    'Azure AI Translator': <TextTranslationIcon />,
    'Google Cloud Platform': <GoogleCloudIcon />,
    'Google Gemini API': <GeminiIcon />,
    'Google AI Studio': <GeminiIcon />, // Using Gemini as proxy
    'Microsoft Copilot': <MicrosoftCopilotIcon />,
    'GitHub Copilot': <GitHubCopilotIcon />,
    'React & TypeScript': <ReactIcon />,
    // Fix: Changed from GitHubIcon to GithubIcon to match the updated import.
    'GitHub': <GithubIcon />,
    'AI Assisted Coding': <AiAssistedCodingIcon />,
    'Codage Assisté par IA': <AiAssistedCodingIcon />,
    'VS Code': <VsCodeIcon />,
    'Postman': <PostmanIcon />,
    'Power Fx': <PowerFxIcon />,
};


interface Technology {
    name: string;
    description: string;
}

interface TechnologySpotlightProps {
    technologies: Technology[];
}

const TechnologySpotlight: React.FC<TechnologySpotlightProps> = ({ technologies }) => (
    <div className="tech-spotlight-grid">
        {technologies.map((tech, index) => (
            <div key={index} className="tech-spotlight-card">
                <div className="tech-spotlight-icon-wrapper">
                    {iconMap[tech.name] || <CodeIcon />}
                </div>
                <h4 className="tech-spotlight-name">{tech.name}</h4>
                <p className="tech-spotlight-description">{tech.description}</p>
            </div>
        ))}
    </div>
);

export default TechnologySpotlight;