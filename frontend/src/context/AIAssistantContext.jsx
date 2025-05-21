import React, { createContext, useState } from 'react';
import { fetchAIResponse } from '../services/aiService';

export const AIAssistantContext = createContext();

export const AIAssistantProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState([]);

  const askQuestion = async (question, questionContext) => {
    setIsLoading(true);
    
    try {
      // Add the user's question to the conversation
      setConversation(prev => [...prev, { role: 'user', content: question }]);
      
      // Get AI response
      const response = await fetchAIResponse(question, questionContext);
      
      // Add AI's response to the conversation
      setConversation(prev => [...prev, { role: 'assistant', content: response }]);
      
      return response;
    } catch (error) {
      console.error('Error asking AI:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    setConversation([]);
  };

  return (
    <AIAssistantContext.Provider value={{
      isLoading,
      conversation,
      askQuestion,
      clearConversation
    }}>
      {children}
    </AIAssistantContext.Provider>
  );
};
