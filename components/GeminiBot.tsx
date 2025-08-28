import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import { GoogleGenAI, Chat, Part } from '@google/genai';
import { useI18n } from '../i18n/useI18n';
import GeminiIcon from './icons/GeminiIcon';
import PaperAirplaneIcon from './icons/PaperAirplaneIcon';
import PaperclipIcon from './icons/PaperclipIcon';
import XMarkIcon from './icons/XMarkIcon';
import * as analytics from '../analytics';
import BrandLogo from './icons/BrandLogo';
import UserIcon from './icons/UserIcon';
import ThumbsUpIcon from './icons/ThumbsUpIcon';
import ThumbsDownIcon from './icons/ThumbsDownIcon';
import '../styles/GeminiBot.css';

interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
    feedback?: 'liked' | 'disliked';
}

const TypingIndicator = () => (
    <div className="typing-indicator">
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
    </div>
);

const generateProactiveSuggestion = (route: string, t: (key: string, replacements?: { [key: string]: string }) => any): string | null => {
    if (route.startsWith('#/projects/')) {
        const slug = route.substring('#/projects/'.length).split('?')[0];
        const project = (t('projects.items') || []).find((p: any) => p.slug === slug);
        if (project && t('geminiBot.proactive.projectPage')) {
            return t('geminiBot.proactive.projectPage', { title: project.title });
        }
    }
    if (route.startsWith('#/use-cases') && t('geminiBot.proactive.useCasesPage')) {
        return t('geminiBot.proactive.useCasesPage');
    }
    return null;
};

interface GeminiBotProps {
    currentRoute: string;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    intent: 'default' | 'bug_report';
    setIntent: Dispatch<SetStateAction<'default' | 'bug_report'>>;
}


const GeminiBot: React.FC<GeminiBotProps> = ({ currentRoute, isOpen, setIsOpen, intent, setIntent }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const { t, language } = useI18n();
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const isInitialized = useRef(false);
    const lastSuggestedRoute = useRef<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [imagePayload, setImagePayload] = useState<Part | null>(null);


    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const getSystemInstruction = () => {
        const navPages = ['home', 'about', 'experience', 'education', 'certificates', 'useCases', 'blog', 'media', 'techStack', 'contact'];
        const useCaseIndustries = Array.from(new Set((t('useCases.catalogue') || []).map((uc: any) => uc.industry)));
        const useCaseTechs = ['Copilot Studio', 'Power Automate'];

        return `You are ElliotBot, an AI co-pilot for Elliot Margot's portfolio website. Your primary role is to help users by answering questions and performing actions.

        RULES:
        1.  You MUST respond in the user's language, which is currently: ${language === 'en' ? 'English' : 'French'}.
        2.  For general questions, answer ONLY from the context provided below. If the answer isn't there, say you don't have that information.
        3.  To perform an action, you MUST respond with a single, valid JSON object and nothing else.
        4.  You MUST use simple HTML for formatting when giving text answers. Specifically, use <b> for bolding, and <ul> with <li> for lists. Use <br> for line breaks. Do NOT use markdown.
        5.  You MUST use relevant emojis to make the tone friendlier. 😃
        
        TOOLS:

        1.  **Navigation Tool**: Use this to navigate the user to different pages.
            -   **tool_name**: "navigateTo"
            -   **path**: The hash path for the page. Valid paths are: ${navPages.map(p => `"#/${p === 'home' ? '' : p}"`).join(', ')}
            -   **Example**: User says "Take me to the blog". You respond: \`{"tool_name": "navigateTo", "path": "#/blog"}\`

        2.  **Use Case Filtering Tool**: Use this to filter the use case library.
            -   **tool_name**: "filterUseCases"
            -   **filters**: An object containing 'industry' and/or 'technology' keys.
            -   **Valid Industries**: "${useCaseIndustries.join('", "')}"
            -   **Valid Technologies**: "${useCaseTechs.join('", "')}"
            -   **Example 1**: User says "Show me insurance use cases". You respond: \`{"tool_name": "filterUseCases", "filters": {"industry": "Insurance"}}\`
            -   **Example 2**: User says "Find manufacturing examples using Power Automate". You respond: \`{"tool_name": "filterUseCases", "filters": {"industry": "Manufacturing", "technology": "Power Automate"}}\`

        3.  **Bug Reporting Tool**: Use this to let the user report a bug via email. If the user uploads an image, you MUST analyze the image and include a detailed description of what you see in the 'description' field of your JSON response.
            -   **tool_name**: "reportBug"
            -   **description**: A string describing the bug the user found, including a detailed description of the attached screenshot if provided.
            -   **Example**: User says "The project images are not loading on the homepage". You respond: \`{"tool_name": "reportBug", "description": "The project images are not loading on the homepage"}\`

        --- START OF CONTEXT ---
        ${getContext()}
        --- END OF CONTEXT ---
        `;
    };
    
    const getContext = () => {
         const about = t('about');
        const experience = t('experience.timeline');
        return `
            ABOUT ELLIOT MARGOT:
            ${JSON.stringify(about.intro)}
            KEY SKILLS:
            ${(about.skills?.items || []).map((s: any) => `- ${s.name}: ${s.description}`).join('\n')}

            PROFESSIONAL EXPERIENCE:
            ${(experience || []).map((e: any) => `- ${e.role} at ${e.company} (${e.period}): ${e.points.join(', ')}`).join('\n')}
        `;
    };

    const initializeChat = () => {
        try {
            const apiKey = process.env.API_KEY;
            if (!apiKey) {
                console.error("API_KEY environment variable not set.");
                return;
            }
            const ai = new GoogleGenAI({ apiKey });
            const newChat = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: getSystemInstruction(),
                },
            });
            setChat(newChat);
            setMessages([{ role: 'model', text: t('geminiBot.initialMessage'), id: `init-${Date.now()}` }]);
        } catch (error) {
            console.error("Error initializing Gemini Chat:", error);
            setMessages([{ role: 'model', text: "Sorry, I'm having trouble connecting right now.", id: `error-${Date.now()}` }]);
        }
    };
    
    useEffect(() => {
        // Re-initialize chat only when language changes to reset context and greeting.
        if (isInitialized.current) {
            initializeChat();
        }
    }, [language]);
    
    useEffect(() => {
        if (isOpen && !isInitialized.current) {
            initializeChat();
            isInitialized.current = true;
        }
    }, [isOpen]);

    useEffect(() => {
        // For bug reports, add a contextual message after initialization
        if (isOpen && intent === 'bug_report' && messages.length > 0 && !messages.some(m => m.id.startsWith('bug-report-prompt'))) {
             const bugReportMessage: Message = {
                id: `bug-report-prompt-${Date.now()}`,
                role: 'model',
                text: t('geminiBot.bugReportPrompt') || "I see you want to report a bug. Please describe the issue you're facing, including the page and what you were trying to do."
            };
            setMessages(prev => [...prev, bugReportMessage]);
            setIntent('default');
        }
    }, [isOpen, intent, messages, setIntent, t]);

    useEffect(() => {
        if (isOpen && messages.length > 0 && lastSuggestedRoute.current !== currentRoute) {
            const suggestion = generateProactiveSuggestion(currentRoute, t);
            if (suggestion) {
                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        id: `proactive-${Date.now()}`,
                        role: 'model',
                        text: suggestion,
                    }]);
                    lastSuggestedRoute.current = currentRoute;
                }, 800);
            }
        }
    }, [isOpen, currentRoute, t, messages.length]);


    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!input.trim() && !imagePayload) || isLoading || !chat) return;

        const userMessage: Message = { role: 'user', text: input, id: `user-${Date.now()}` };
        setMessages(prev => [...prev, userMessage]);
        analytics.trackEvent('send_gemini_bot_message', { message_length: input.trim().length, has_image: imagePayload ? 1 : 0 });
        setInput('');
        setPreviewImage(null);
        
        setIsLoading(true);
        const modelMessageId = `model-${Date.now()}`;
        setMessages(prev => [...prev, { role: 'model', text: '', id: modelMessageId }]);

        try {
            const messageParts: (string | Part)[] = [input];
            if (imagePayload) {
                messageParts.push(imagePayload);
            }
            setImagePayload(null);

            const stream = await chat.sendMessageStream({ message: messageParts });
            let fullResponse = '';
            for await (const chunk of stream) {
                fullResponse += chunk.text;
                setMessages(prev => prev.map(m => m.id === modelMessageId ? { ...m, text: fullResponse } : m));
            }

            try {
                const toolCall = JSON.parse(fullResponse);
                if (toolCall.tool_name) {
                    executeTool(toolCall, modelMessageId);
                }
            } catch (jsonError) {
                // Not a JSON tool call, just a regular text response. Do nothing.
            }

        } catch (error) {
            console.error("Error sending message to Gemini:", error);
            const errorMessage = "Sorry, something went wrong. Please try again.";
            setMessages(prev => prev.map(m => m.id === modelMessageId ? { ...m, text: errorMessage } : m));
        } finally {
            setIsLoading(false);
        }
    };
    
     const handleFeedback = (messageId: string, feedback: 'liked' | 'disliked') => {
        setMessages(prevMessages =>
            prevMessages.map(msg =>
                msg.id === messageId ? { ...msg, feedback } : msg
            )
        );
        const messageText = messages.find(m => m.id === messageId)?.text || '';
        analytics.trackEvent('gemini_bot_feedback', {
            rating: feedback,
            message_text: messageText.substring(0, 100)
        });
    };

    const executeTool = (toolCall: any, modelMessageId: string) => {
        let confirmationMessage = '';
        switch (toolCall.tool_name) {
            case 'navigateTo':
                if (toolCall.path) {
                    window.location.hash = toolCall.path;
                    confirmationMessage = `Navigating to ${toolCall.path.replace('#/', '')}...`;
                    analytics.trackEvent('gemini_bot_tool_use', { tool_name: 'navigateTo', path: toolCall.path });
                }
                break;
            case 'filterUseCases':
                 if (toolCall.filters) {
                    const params = new URLSearchParams(toolCall.filters);
                    window.location.hash = `#/use-cases?${params.toString()}`;
                    confirmationMessage = `Applying filters: ${params.toString()}`;
                     analytics.trackEvent('gemini_bot_tool_use', { tool_name: 'filterUseCases', filters: JSON.stringify(toolCall.filters) });
                }
                break;
            case 'reportBug': {
                const bugDescription = toolCall.description || "No description provided.";
                const subject = encodeURIComponent(t('bugReport.subject'));
                const bodyTemplate = t('bugReport.bodyTemplate');
                const body = encodeURIComponent(
                    `Hello Elliot,\n\nI'd like to report a bug found via ElliotBot.\n\n**User's Description:**\n${bugDescription}\n\n--- PRE-FILLED TEMPLATE ---\n\n${bodyTemplate}`
                );
                window.location.href = `mailto:elliottus12@gmail.com?subject=${subject}&body=${body}`;
                confirmationMessage = t('geminiBot.reportBugConfirmation');
                analytics.trackEvent('gemini_bot_tool_use', { tool_name: 'reportBug' });
                break;
            }
            default:
                confirmationMessage = "I'm not sure how to do that.";
        }
        setMessages(prev => prev.map(m => m.id === modelMessageId ? { ...m, text: confirmationMessage } : m));
    };

    const toggleOpen = () => {
        const newIsOpen = !isOpen;
        setIsOpen(newIsOpen);
        analytics.trackEvent(newIsOpen ? 'open_gemini_bot' : 'close_gemini_bot', { route: currentRoute });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = (reader.result as string).split(',')[1];
                setPreviewImage(reader.result as string);
                setImagePayload({
                    inlineData: {
                        mimeType: file.type,
                        data: base64String
                    }
                });
            };
            reader.readAsDataURL(file);
        }
         // Reset file input value to allow re-uploading the same file
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const removeImage = () => {
        setPreviewImage(null);
        setImagePayload(null);
    }

    return (
        <>
            <button
                onClick={toggleOpen}
                className="gemini-fab"
                aria-label="Toggle chatbot"
            >
                <div className={`gemini-fab-icon-wrapper ${isOpen ? 'is-open' : ''}`}>
                    <GeminiIcon className="gemini-fab-icon gemini" />
                    <XMarkIcon className="gemini-fab-icon x-mark" />
                </div>
            </button>

            {isOpen && (
                <div className="gemini-bot-window">
                    <header className="gemini-bot-header">
                        <div>
                            <h3 className="gemini-bot-title">{t('geminiBot.headerTitle')}</h3>
                            <p className="gemini-bot-subtitle">AI Assistant</p>
                        </div>
                    </header>
                    <div ref={chatContainerRef} className="gemini-bot-body">
                        <div className="message-list">
                            {messages.map((msg) => (
                                <div key={msg.id} className="message-item">
                                    <div className={`message-bubble-wrapper ${msg.role === 'user' ? 'user' : 'model'}`}>
                                        {msg.role === 'model' && (
                                            <div className="avatar-wrapper">
                                                <BrandLogo className="w-5 h-5" />
                                            </div>
                                        )}
                                        <div className={`message-bubble ${msg.role}`}>
                                            {isLoading && msg.role === 'model' && msg.text === '' ? (
                                                <TypingIndicator />
                                            ) : (
                                                <div className="message-text" dangerouslySetInnerHTML={{ __html: msg.text }}></div>
                                            )}
                                        </div>
                                        {msg.role === 'user' && (
                                            <div className="avatar-wrapper">
                                                <UserIcon className="w-5 h-5" />
                                            </div>
                                        )}
                                    </div>
                                    {msg.role === 'model' && msg.text && !isLoading && (
                                        <div className="feedback-wrapper">
                                            <button 
                                                onClick={() => handleFeedback(msg.id, 'liked')}
                                                disabled={!!msg.feedback}
                                                className={`feedback-button ${msg.feedback === 'liked' ? 'liked' : ''}`}
                                                aria-label="Good response"
                                            >
                                                <ThumbsUpIcon className="w-4 h-4"/>
                                            </button>
                                             <button 
                                                onClick={() => handleFeedback(msg.id, 'disliked')}
                                                disabled={!!msg.feedback}
                                                className={`feedback-button ${msg.feedback === 'disliked' ? 'disliked' : ''}`}
                                                aria-label="Bad response"
                                            >
                                                <ThumbsDownIcon className="w-4 h-4"/>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <form onSubmit={handleSendMessage} className="gemini-bot-form">
                        {previewImage && (
                            <div className="image-preview-container">
                                <img src={previewImage} alt="Image preview" className="image-preview" />
                                <button onClick={removeImage} type="button" className="remove-image-button" aria-label="Remove image">
                                    <XMarkIcon />
                                </button>
                            </div>
                        )}
                        <div className="input-wrapper">
                             <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                accept="image/*"
                                style={{ display: 'none' }}
                                aria-hidden="true"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="attachment-button"
                                disabled={isLoading}
                                aria-label="Attach image"
                            >
                                <PaperclipIcon className="w-5 h-5" />
                            </button>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={t('geminiBot.placeholder')}
                                className="text-input"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                className="send-button"
                                disabled={isLoading || (!input.trim() && !imagePayload)}
                                aria-label="Send message"
                            >
                                <PaperAirplaneIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default GeminiBot;