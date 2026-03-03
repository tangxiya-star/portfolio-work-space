
import React, { useState, useRef, useEffect } from 'react';
import { Send, X } from 'lucide-react';
import { generateCuratorResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import BeanCharacter from './BeanCharacter';

const CuratorAI: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hello! I'm Holly's helper bean. I can help you find specific projects or talk about her strategy. What would you like to explore?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    const newHistory: ChatMessage[] = [...messages, { role: 'user', text: userMsg }];
    setMessages(newHistory);
    setIsLoading(true);

    const responseText = await generateCuratorResponse(newHistory);
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  return (
    <>
      {/* Helper Bean as the MAIN trigger button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <button 
            onClick={() => setIsOpen(true)}
            className="animate-bean-float focus:outline-none focus:ring-2 focus:ring-[#A5B9F9] focus:ring-offset-2 rounded-full transition-transform hover:scale-110 active:scale-95 group"
            aria-label="Open AI Assistant"
          >
             <div className="relative">
               {/* Decorative shadow for the bean to sit on */}
               <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-2 bg-black/10 blur-sm rounded-full transform translate-y-1 opacity-0 group-hover:opacity-100 transition-opacity" />
               <BeanCharacter size={70} className="drop-shadow-lg" />
             </div>
          </button>
        )}
      </div>

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 md:w-96 h-[520px] bg-white border-[3px] border-[#121212] rounded-none shadow-[10px_10px_0px_rgba(0,0,0,0.1)] flex flex-col z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300">
          {/* Black Banner Header */}
          <div className="bg-[#121212] p-5 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-1 rounded-md border border-gray-800 shadow-sm">
                <BeanCharacter size={28} />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-lg leading-none text-white">The Curator</span>
                <span className="text-[9px] text-gray-400 uppercase tracking-[0.2em] font-black mt-1">Holly's Assistant</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
              <X size={22} />
            </button>
          </div>

          {/* Chat Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-white paper-texture">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 text-sm leading-relaxed border-[2px] ${
                  msg.role === 'user' 
                    ? 'bg-white border-gray-200 text-[#121212] font-medium' 
                    : 'bg-[#F7DA21] border-[#121212] text-[#121212] font-bold shadow-[4px_4px_0px_#121212]'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-50 border border-gray-100 p-4 rounded-none flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
                  <span className="text-[12px] uppercase font-black text-gray-400 tracking-widest">Pondering...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-5 bg-[#FAF9F6] border-t-[3px] border-[#121212]">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask the helper bean..."
                className="w-full bg-white border-[2px] border-gray-300 rounded-none py-3 pl-5 pr-12 text-sm focus:outline-none focus:border-[#121212] transition-colors font-sans"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-3 text-gray-400 hover:text-[#121212] disabled:opacity-30 transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
            <div className="mt-4 text-[9px] text-gray-400 text-center font-black uppercase tracking-[0.4em]">
              Holly Tang Design Hub • AI Helper
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CuratorAI;
