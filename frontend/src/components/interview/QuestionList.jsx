import React, { useState } from 'react';
import QuestionCard from './QuestionCard';

const QuestionList = ({ questions }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get unique tags from all questions
  const allTags = [...new Set(questions.flatMap(q => q.tags))];
  
  // Filter questions based on selected filters
  const filteredQuestions = questions.filter(question => {
    // Filter by difficulty
    if (selectedDifficulty !== 'all' && question.difficulty.toLowerCase() !== selectedDifficulty) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !question.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by tags
    if (selectedTags.length > 0 && !selectedTags.some(tag => question.tags.includes(tag))) {
      return false;
    }
    
    return true;
  });
  
  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? 
        prev.filter(t => t !== tag) : 
        [...prev, tag]
    );
  };
  
  return (
    <div>
      <div className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Search questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border border-secondary-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
        />
        
        <div>
          <h3 className="text-sm font-medium text-secondary-700 mb-2">Difficulty</h3>
          <div className="flex flex-wrap gap-2">
            {['all', 'easy', 'medium', 'hard'].map(difficulty => (
              <button
                key={difficulty}
                onClick={() => setSelectedDifficulty(difficulty)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedDifficulty === difficulty
                    ? 'bg-primary-100 text-primary-800 border border-primary-300'
                    : 'bg-secondary-100 text-secondary-800 border border-secondary-200 hover:bg-secondary-200'
                }`}
              >
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-secondary-700 mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedTags.includes(tag)
                    ? 'bg-primary-100 text-primary-800 border border-primary-300'
                    : 'bg-secondary-100 text-secondary-800 border border-secondary-200 hover:bg-secondary-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {filteredQuestions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-secondary-600">No questions match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuestions.map(question => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionList;
