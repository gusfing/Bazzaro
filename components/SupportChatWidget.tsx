
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, CornerDownLeft, Loader2 } from 'lucide-react';
import { GoogleGenAI, Chat, GenerateContentResponse } from '@google/genai';
import { ChatMessage } from '../types';

declare var process: {
  env: {
    API_KEY: string;
  }
};

const SupportChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize the chat session when the component mounts
    const initializeChat = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const newChat = ai.chats.create({
          model: 'gemini-3-flash-preview',
          config: {
            systemInstruction: 'You are a friendly and helpful BAZZARO support assistant specializing in luxury fashion. You are knowledgeable about materials, craftsmanship, and order details. Keep responses concise and helpful.',
          },
        });
        setChat(newChat);
        setMessages([
          {
            id: 'welcome-message',
            role: 'model',
            text: "Hello! Welcome to BAZZARO. How can I assist you with our collection today?"
          }
        ]);
      } catch (error) {
        console.error("Failed to initialize chat:", error);
        setMessages([
            {
                id: 'error-message',
                role: 'model',
                text: "Sorry, I'm currently unavailable. Please try again later."
            }
        ]);
      }
    };
    initializeChat();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || !chat) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: inputValue,
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
        const stream = await chat.sendMessageStream({ message: inputValue });
        let modelResponse = '';
        const modelMessageId = `model-${Date.now()}`;

        // Create an initial empty message for the model
        setMessages(prev => [...prev, { id: modelMessageId, role: 'model', text: '' }]);

        for await (const chunk of stream) {
            const c = chunk as GenerateContentResponse
            modelResponse += c.text;
            setMessages(prev => prev.map(msg => 
                msg.id === modelMessageId ? { ...msg, text: modelResponse } : msg
            ));
        }
    } catch (error) {
        console.error("Error sending message:", error);
        setMessages(prev => [...prev, {
            id: `error-${Date.now()}`,
            role: 'model',
            text: "I'm having trouble connecting right now. Please try again."
        }]);
    } finally {
        setIsLoading(false);
    }
  };
  
  const iconVariants = {
    closed: { scale: 1, rotate: 0 },
    open: { scale: 0.8, rotate: 180 },
  };
  
  const widgetVariants = {
    closed: { opacity: 0, y: 20, scale: 0.95 },
    open: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <>
      {/* FAB */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[200] w-16 h-16 bg-brand-gray-900 text-brand-gray-50 rounded-full shadow-2xl flex items-center justify-center border border-brand-gray-700 hover:bg-brand-gray-800 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <div className="relative w-6 h-6">
            <AnimatePresence>
                <motion.div key={isOpen ? 'close' : 'chat'} initial={{opacity: 0, scale: 0.5}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.5}} className="absolute inset-0">
                    {isOpen ? <X/> : <MessageSquare />}
                </motion.div>
            </AnimatePresence>
        </div>
        {!isOpen && <span className="absolute w-full h-full rounded-full bg-brand-tan animate-pulse-dot" style={{animationDelay: '1s'}}/>}
      </motion.button>
      
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={widgetVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed bottom-24 right-6 z-[199] w-[calc(100vw-3rem)] max-w-sm h-[70vh] max-h-[600px] bg-brand-gray-950/80 backdrop-blur-2xl border border-brand-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <header className="p-4 border-b border-brand-gray-800 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-brand-espresso flex items-center justify-center text-brand-sand text-xs font-bold">B</div>
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-brand-success rounded-full border-2 border-brand-gray-900"></span>
                    </div>
                    <div>
                        <h3 className="font-bold text-sm text-brand-gray-50">Live Support</h3>
                        <p className="text-xs text-brand-gray-400">Online</p>
                    </div>
                </div>
            </header>
            
            {/* Messages */}
            <div className="flex-grow p-4 overflow-y-auto scrollbar-hide space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex items-end gap-2 ${message.role === 'user' ? 'justify-end' : ''}`}>
                    {message.role === 'model' && <div className="w-6 h-6 rounded-full bg-brand-espresso text-brand-sand text-[10px] font-bold flex items-center justify-center shrink-0">B</div>}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                            message.role === 'user' 
                            ? 'bg-brand-sand text-brand-gray-950 rounded-br-none' 
                            : 'bg-brand-gray-800 text-brand-gray-200 rounded-bl-none'
                        }`}
                    >
                        {message.text}
                    </motion.div>
                </div>
              ))}
              {isLoading && (
                 <div className="flex items-end gap-2">
                    <div className="w-6 h-6 rounded-full bg-brand-espresso text-brand-sand text-[10px] font-bold flex items-center justify-center shrink-0">B</div>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-brand-gray-800 rounded-2xl rounded-bl-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-brand-gray-500 rounded-full animate-pulse" />
                        <span className="w-1.5 h-1.5 bg-brand-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <span className="w-1.5 h-1.5 bg-brand-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </motion.div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input */}
            <footer className="p-4 border-t border-brand-gray-800">
                <form onSubmit={handleSendMessage} className="relative">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type your message..."
                        disabled={isLoading || !chat}
                        className="w-full h-12 bg-brand-gray-900 text-brand-gray-50 rounded-full pl-5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-brand-tan/50 transition-all placeholder:text-brand-gray-500 disabled:opacity-50"
                    />
                    <button type="submit" disabled={isLoading || !inputValue.trim() || !chat} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-brand-tan text-brand-gray-950 rounded-full flex items-center justify-center transition-all hover:bg-white active:scale-90 disabled:bg-brand-gray-700 disabled:text-brand-gray-500 disabled:cursor-not-allowed">
                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    </button>
                </form>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SupportChatWidget;
