import React from 'react';
import '../styles/Timeline.css';

interface TimelineItemProps {
  title: string;
  subtitle: string;
  period: string;
  description: string[];
  imageUrl?: string;
  techStack?: string[];
}

const TimelineItem: React.FC<TimelineItemProps> = ({ title, subtitle, period, description, imageUrl, techStack }) => (
    <div className="timeline-item">
        <div className="timeline-item-content">
            <span className="timeline-item-period">{period}</span>
            <h3 className="timeline-item-title">{title}</h3>
            <h4 className="timeline-item-subtitle">{subtitle}</h4>
            <div className="timeline-item-body">
                {imageUrl && <img src={imageUrl} alt={subtitle} className="timeline-item-image" loading="lazy" />}
                <ul className="timeline-item-description">
                    {description.map((point, index) => <li key={index}>{point}</li>)}
                </ul>
            </div>
            {techStack && techStack.length > 0 && (
                <div className="timeline-tech-stack">
                    <h5 className="tech-stack-title">Key Skills & Technologies</h5>
                    <div className="tech-stack-pills">
                        {techStack.map((tech, index) => (
                            <span key={index} className="tech-stack-pill">{tech}</span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    </div>
);

interface TimelineProps {
    items: Omit<TimelineItemProps, 'isLast'>[];
}

const Timeline: React.FC<TimelineProps> = ({ items }) => (
    <div className="timeline-wrapper">
        {items.map((item, index) => (
            <TimelineItem key={index} {...item} />
        ))}
    </div>
);

export default Timeline;