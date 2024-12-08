import React, { useEffect } from 'react';
import { Button } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const EditorPage = () => {
  const [prompt, setPrompt] = React.useState('');
  const [response, setResponse] = React.useState('');
  const [selectedFiles, setSelectedFiles] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    const files = JSON.parse(localStorage.getItem('selectedFiles') || '[]');
    setSelectedFiles(files);
  }, []);

  const handlePromptSubmit = async () => {
    try {
      setIsLoading(true);
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
      });
      setResponse(completion.choices[0].message.content || '');
    } catch (error) {
      console.error('Error fetching GPT response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>GPT Prompt Test</h2>
      <div>
        <h3>Selected Files:</h3>
        <ul>
          {selectedFiles.map((file, index) => (
            <li key={index}>{file}</li>
          ))}
        </ul>
      </div>
      <TextArea
        rows={4}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt"
        style={{ marginBottom: '20px' }}
      />
      <Button type="primary" loading={isLoading} onClick={handlePromptSubmit}>
        Submit to GPT
      </Button>
      <div style={{ marginTop: '20px' }}>
        <h3>Response:</h3>
        <TextArea rows={10} value={response} readOnly style={{ background: '#f5f5f5' }} />
      </div>
    </div>
  );
};

export default EditorPage;
