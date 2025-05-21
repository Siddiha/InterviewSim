import React from 'react';

const TestCases = ({ testCases, results }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-secondary-900">Test Cases</h3>
      
      <div className="space-y-2">
        {testCases.map((testCase, index) => {
          const result = results?.[index];
          const isPassed = result?.passed;
          
          return (
            <div
              key={index}
              className="p-4 border border-secondary-200 rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-secondary-900">
                  Test Case {index + 1}
                </span>
                {result && (
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      isPassed
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {isPassed ? 'Passed' : 'Failed'}
                  </span>
                )}
              </div>
              
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-secondary-600">Input:</span>
                  <pre className="mt-1 p-2 bg-secondary-50 rounded text-sm">
                    {JSON.stringify(testCase.input, null, 2)}
                  </pre>
                </div>
                
                <div>
                  <span className="text-sm text-secondary-600">Expected Output:</span>
                  <pre className="mt-1 p-2 bg-secondary-50 rounded text-sm">
                    {JSON.stringify(testCase.expectedOutput, null, 2)}
                  </pre>
                </div>
                
                {result && !isPassed && (
                  <div>
                    <span className="text-sm text-secondary-600">Actual Output:</span>
                    <pre className="mt-1 p-2 bg-red-50 rounded text-sm text-red-800">
                      {JSON.stringify(result.actualOutput, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TestCases;
