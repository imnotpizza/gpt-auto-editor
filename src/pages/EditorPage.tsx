// EditorPage.js
import React, { useState } from 'react';
import { Button, Input, message } from 'antd';

const EditorPage = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const handlePromptSubmit = async () => {
    if (!prompt.trim()) {
      message.warning('Please enter a prompt.');
      return;
    }

    try {
      // ChatGPT API 호출 예시
      const res = await fetch('/api/chatgpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error('Error fetching GPT response:', error);
      message.error('Failed to fetch response.');
    }
  };

  return (
    <div>
      <Input.TextArea
        rows={4}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt here"
        style={{ marginBottom: '20px' }}
      />
      <Button type="primary" onClick={handlePromptSubmit}>
        Submit Prompt
      </Button>
      {response && (
        <div style={{ marginTop: '20px', whiteSpace: 'pre-wrap' }}>
          <h3>Response:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default EditorPage;
