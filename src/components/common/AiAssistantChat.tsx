// components/AIAssistant.jsx
'use client';

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

const AIAssistant = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I'm your LendXChange assistant. How can I help you today?", 
      isBot: true 
    },
    { 
      id: 2, 
      text: "I can help with understanding lending options, calculating potential returns, explaining DeFi concepts, and navigating the platform.", 
      isBot: true 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;
    
    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      text: inputMessage,
      isBot: false
    };
    
    setMessages([...messages, newUserMessage]);
    setInputMessage('');
    
    // In a real implementation, you would call your AI API here
    // For now, we'll simulate a response after a delay
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: "I'm a demo assistant. In the real implementation, I would connect to your AI backend to provide helpful responses.",
        isBot: true
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: { key: string; }) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* AI Assistant Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={toggleChat}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          aria-label="Chat with AI Assistant"
        >
          {isChatOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </button>
      </div>

       {/* Chat Window */}
       {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[28rem] sm:h-[32rem] bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-40 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between bg-gray-800 px-4 py-3 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <h3 className="text-white font-medium">LendXChange AI Assistant</h3>
            </div>
            <button onClick={toggleChat} className="text-gray-400 hover:text-white">
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-grow p-4 overflow-y-auto bg-gray-900">
            <div className="flex flex-col space-y-3">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`rounded-lg p-3 max-w-[80%] text-sm text-white ${
                    message.isBot 
                      ? 'bg-gray-800 self-start' 
                      : 'bg-indigo-600 self-end'
                  }`}
                >
                  {message.text}
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-3 border-t border-gray-700">
            <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
              <input 
                type="text" 
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your question here..." 
                className="flex-grow bg-transparent text-white text-sm outline-none"
              />
              <button 
                onClick={handleSendMessage}
                className="ml-2 text-purple-400 hover:text-purple-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;