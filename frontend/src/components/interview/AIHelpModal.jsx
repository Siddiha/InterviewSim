import React, { useState } from 'react';
import { useAIAssistant } from '../../hooks/useAIAssistant';

const AIHelpModal = ({ isOpen, onClose, question }) => {
  const [message, setMessage] = useState('');
  const { messages, askQuestion, isLoading, error } = useAIAssistant();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    await askQuestion(message);
    setMessage('');
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-secondary-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-secondary-900">AI Help</h3>
          <button
            onClick={onClose}
            className="text-secondary-500 hover:text-secondary-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === 'user'
                    ? 'bg-primary-500 text-white'
                    : 'bg-secondary-100 text-secondary-900'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-secondary-100 text-secondary-900 rounded-lg p-3">
                Thinking...
              </div>
            </div>
          )}
          
          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 border-t border-secondary-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask for help..."
              className="flex-1 p-2 border border-secondary-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIHelpModal;
