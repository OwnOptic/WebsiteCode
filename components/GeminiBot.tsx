import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { useI18n } from '../i18n/useI18n';
import ChatBubbleIcon from './icons/ChatBubbleIcon';
import PaperAirplaneIcon from './icons/PaperAirplaneIcon';
import XMarkIcon from './icons/XMarkIcon';
import * as analytics from '../analytics';
import BrandLogo from './icons/BrandLogo';
import UserIcon from './icons/UserIcon';

interface Message {
    role: 'user' | 'model';
    text: string;
}

const TypingIndicator = () => (
    <div className="flex items-center space-x-1.5 py-2">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
    </div>
);


const GeminiBot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const { t, language } = useI18n();
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const isInitialized = useRef(false);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const getSystemInstruction = () => {
        const navPages = ['home', 'about', 'experience', 'education', 'certificates', 'useCases', 'blog', 'media', 'techStack', 'contact'];
        const useCaseIndustries = Array.from(new Set((t('useCases.catalogue') || []).map((uc: any) => uc.industry)));
        const useCaseTechs = ['Copilot Studio', 'Power Automate'];

        return `You are EllioBot, an AI co-pilot for Elliot Margot's portfolio website. Your primary role is to help users by answering questions and performing actions.

        RULES:
        1.  You MUST respond in the user's language, which is currently: ${language === 'en' ? 'English' : 'French'}.
        2.  For general questions, answer ONLY from the context provided below. If the answer isn't there, say you don't have that information.
        3.  To perform an action, you MUST respond with a single, valid JSON object and nothing else.
        
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
            setMessages([{ role: 'model', text: t('geminiBot.initialMessage') }]);
        } catch (error) {
            console.error("Error initializing Gemini Chat:", error);
            setMessages([{ role: 'model', text: "Sorry, I'm having trouble connecting right now." }]);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !chat) return;

        const userMessage: Message = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        analytics.trackEvent('send_gemini_bot_message', { message_length: input.trim().length });
        setInput('');
        setIsLoading(true);

        setMessages(prev => [...prev, { role: 'model', text: '' }]);

        try {
            const stream = await chat.sendMessageStream({ message: input });
            let fullResponse = '';
            for await (const chunk of stream) {
                fullResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text = fullResponse;
                    return newMessages;
                });
            }

            try {
                const toolCall = JSON.parse(fullResponse);
                if (toolCall.tool_name) {
                    executeTool(toolCall);
                }
            } catch (jsonError) {
                // Not a JSON tool call, just a regular text response. Do nothing.
            }

        } catch (error) {
            console.error("Error sending message to Gemini:", error);
            const errorMessage = "Sorry, something went wrong. Please try again.";
            setMessages(prev => {
                 const newMessages = [...prev];
                 newMessages[newMessages.length - 1].text = errorMessage;
                 return newMessages;
            });
        } finally {
            setIsLoading(false);
        }
    };

    const executeTool = (toolCall: any) => {
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
            default:
                confirmationMessage = "I'm not sure how to do that.";
        }
        
        setMessages(prev => {
             const newMessages = [...prev];
             newMessages[newMessages.length - 1].text = confirmationMessage;
             return newMessages;
        });
    };

    const toggleOpen = () => {
        const newIsOpen = !isOpen;
        setIsOpen(newIsOpen);
        if (newIsOpen) {
            analytics.trackEvent('open_gemini_bot', {});
            if (!isInitialized.current) {
                initializeChat();
                isInitialized.current = true;
            }
        }
    };

    useEffect(() => {
        if (isInitialized.current && isOpen) {
            initializeChat();
        }
    }, [language, isOpen]);

    return (
        <>
            <button
                onClick={toggleOpen}
                className="fixed bottom-6 right-6 bg-[var(--interactive-blue)] text-white p-4 rounded-full shadow-lg hover:bg-[var(--interactive-hover)] transition-transform duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--interactive-blue)] z-50"
                aria-label="Toggle chatbot"
            >
                {isOpen ? <XMarkIcon className="w-8 h-8"/> : <ChatBubbleIcon className="w-8 h-8" />}
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 w-[90vw] max-w-md h-[70vh] max-h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 animate-fade-in-up border border-gray-200">
                    <header className="bg-gray-50 p-4 rounded-t-2xl flex justify-between items-center border-b border-gray-200">
                        <div>
                            <h3 className="font-bold text-lg text-[var(--primary-text)]">{t('geminiBot.headerTitle')}</h3>
                            <p className="text-sm text-[var(--secondary-text)]">AI Assistant</p>
                        </div>
                    </header>
                    <div ref={chatContainerRef} className="flex-grow p-4 overflow-y-auto bg-[var(--surface-background)]">
                        <div className="space-y-6">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex items-end gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.role === 'model' && (
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 border-2 border-white">
                                            <BrandLogo className="w-5 h-5" />
                                        </div>
                                    )}
                                    <div className={`max-w-xs md:max-w-sm rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-[var(--interactive-blue)] text-white rounded-br-lg' : 'bg-white text-[var(--primary-text)] border border-gray-200 rounded-bl-lg'}`}>
                                       {isLoading && msg.role === 'model' && index === messages.length - 1 && msg.text === '' ? (
                                            <TypingIndicator />
                                        ) : (
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                        )}
                                    </div>
                                     {msg.role === 'user' && (
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 border-2 border-white">
                                            <UserIcon className="w-5 h-5 text-gray-600" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
                        <div className="flex items-center space-x-2 bg-[var(--surface-background)] rounded-lg pr-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={t('geminiBot.placeholder')}
                                className="flex-grow p-3 bg-transparent border-0 rounded-lg focus:outline-none focus:ring-0 text-sm"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                className="bg-[var(--interactive-blue)] text-white p-2.5 rounded-md hover:bg-[var(--interactive-hover)] disabled:bg-gray-400 transition-colors flex-shrink-0"
                                disabled={isLoading || !input.trim()}
                                aria-label="Send message"
                            >
                                <PaperAirplaneIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </form>
                </div>
            )}
             <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(1rem); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.3s ease-out forwards;
                }
                 @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-4px); }
                }
                .animate-bounce {
                    animation: bounce 1s infinite;
                }
            `}</style>
        </>
    );
};

export default GeminiBot;
