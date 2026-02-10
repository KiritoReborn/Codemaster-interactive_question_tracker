import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, Loader2, Maximize2, Minimize2, AlertCircle } from 'lucide-react';
import { GoogleGenAI, Chat } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hi! I'm your CodeMaster AI assistant. Ask me anything about Data Structures, Algorithms, or help with your current problem sheet!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatSessionRef = useRef<Chat | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Initialize Chat Session
  useEffect(() => {
    // Check for VITE_API_KEY (Vercel/Vite) first, then fallback to process.env
    // @ts-ignore
    const apiKey = import.meta.env?.VITE_API_KEY || process.env.API_KEY;
    
    if (!apiKey) {
      setHasApiKey(false);
      setMessages(prev => [
        ...prev, 
        { 
          role: 'model', 
          text: "Configuration Error: Gemini API Key is missing.\n\nIf you are deploying to Vercel, please set the Environment Variable `VITE_API_KEY` in your project settings.",
          isError: true
        }
      ]);
      return;
    }

    if (!chatSessionRef.current) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        chatSessionRef.current = ai.chats.create({
          model: 'gemini-3-pro-preview',
          config: {
            systemInstruction: "You are an expert Senior Software Engineer and competitive programmer. You help users solve DSA problems, explain concepts (like Arrays, Linked Lists, DP, Graphs), and provide hints without giving away the direct code unless asked. You are integrated into an application called 'CodeMaster', a DSA tracking sheet. Be concise, encouraging, and use markdown for code snippets.",
          }
        });
      } catch (error) {
        console.error("Failed to initialize Gemini client:", error);
        setHasApiKey(false);
        setMessages(prev => [
          ...prev, 
          { 
            role: 'model', 
            text: "Initialization Error: Failed to connect to Gemini API. Please check your API key configuration.",
            isError: true
          }
        ]);
      }
    }
  }, []);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading || !chatSessionRef.current || !hasApiKey) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const result = await chatSessionRef.current.sendMessage({ message: userMessage });
      const responseText = result.text;
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to the server right now. Please try again later.", isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 p-3 md:p-4 rounded-full bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all duration-300 group"
        >
          <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-20 group-hover:opacity-40"></div>
          <MessageSquare size={24} fill="currentColor" className="relative z-10 md:w-7 md:h-7" />
        </button>
      )}

      {/* Chat Interface */}
      {isOpen && (
        <div 
          className={`fixed z-50 flex flex-col transition-all duration-300 shadow-2xl border border-slate-200 dark:border-white/10 glass-panel
            ${isExpanded 
              ? 'inset-0 md:inset-10 md:rounded-2xl' 
              : 'bottom-0 right-0 w-full h-full md:bottom-8 md:right-8 md:w-[400px] md:h-[600px] md:max-h-[calc(100vh-64px)] md:rounded-2xl'
            }
          `}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-white/5 md:rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-inner">
                <Bot size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  CodeMaster AI
                  <Sparkles size={14} className="text-amber-500 dark:text-yellow-400" />
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${hasApiKey ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
                  {hasApiKey ? 'Online' : 'Config Error'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden md:block p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors"
              >
                {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50 dark:bg-black/20">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div 
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 
                    ${msg.role === 'user' ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200' : 
                      msg.isError ? 'bg-red-100 dark:bg-red-900/20 text-red-500' : 'bg-primary/20 text-primary'}
                  `}
                >
                  {msg.role === 'user' ? <User size={16} /> : msg.isError ? <AlertCircle size={16} /> : <Bot size={16} />}
                </div>
                <div 
                  className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm
                    ${msg.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : msg.isError 
                        ? 'bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 rounded-tl-none'
                        : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 text-slate-700 dark:text-slate-200 rounded-tl-none'
                    }
                  `}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center flex-shrink-0">
                  <Bot size={16} />
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
                  <Loader2 size={20} className="animate-spin text-primary" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-4 bg-white/80 dark:bg-white/5 border-t border-slate-200 dark:border-white/5 md:rounded-b-2xl">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={hasApiKey ? "Ask about a problem or concept..." : "API Key missing"}
                className="w-full bg-white dark:bg-black/40 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 border border-slate-200 dark:border-slate-700/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isLoading || !hasApiKey}
              />
              <button 
                type="submit"
                disabled={!input.trim() || isLoading || !hasApiKey}
                className="absolute right-2 p-2 bg-primary/10 dark:bg-primary/20 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-primary/20 disabled:hover:text-primary"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-2">
              AI can make mistakes. Double check important code.
            </p>
          </form>
        </div>
      )}
    </>
  );
};