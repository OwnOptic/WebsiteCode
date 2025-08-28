import React from 'react';
import MaintenanceIcon from './icons/MaintenanceIcon';
import PackageIcon from './icons/PackageIcon';
import SearchIcon from './icons/SearchIcon';
import SeoIcon from './icons/SeoIcon';

const iconMap: { [key: string]: React.ReactNode } = {
    'Discovery': <SearchIcon className="h-8 w-8" />,
    'Strategy': <PackageIcon className="h-8 w-8" />,
    'Implementation': <MaintenanceIcon className="h-8 w-8" />,
    'Growth': <SeoIcon className="h-8 w-8" />
};

interface ProcessStep {
    number: string;
    title: string;
    description: string;
    icon: string;
}

interface ProcessStepsProps {
    steps: ProcessStep[];
}

const ProcessSteps: React.FC<ProcessStepsProps> = ({ steps }) => (
    <div className="process-steps-grid">
        {steps.map((step, index) => (
            <div key={index} className="process-step-card">
                <span className="process-step-number">{step.number}</span>
                <div className="process-step-title-wrapper text-blue-600">
                    {iconMap[step.icon]}
                    <h3 className="process-step-title">{step.title}</h3>
                </div>
                <p className="process-step-description">{step.description}</p>
            </div>
        ))}
    </div>
);

export default ProcessSteps;
