import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ initialCode, language, onChange, readOnly = false }) => {
  const [code, setCode] = useState(initialCode || '');
  
  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
    }
  }, [initialCode]);
  
  const handleEditorChange = (value) => {
    setCode(value);
    if (onChange) {
      onChange(value);
    }
  };
  
  return (
    <div className="code-editor">
      <Editor
        height="500px"
        language={language || 'javascript'}
        value={code}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          contextmenu: true,
          formatOnPaste: true,
          formatOnType: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
