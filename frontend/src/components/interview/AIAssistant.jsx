import React, { useState } from 'react';
import { useAIAssistant } from '../../hooks/useAIAssistant';

const AIAssistant = () => {
  const [message, setMessage] = useState('');
  const { messages, askQuestion, isLoading, error } = useAIAssistant();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    await askQuestion(message);
    setMessage('');
  };
  
  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-lg border border-secondary-200">
      <div className="p-4 border-b border-secondary-200">
        <h3 className="text-lg font-semibold text-secondary-900">AI Assistant</h3>
      </div>
      
      <div className="h-96 overflow-y-auto p-4 space-y-4">
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
            placeholder="Ask a question..."
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
  );
};

export default AIAssistant;
