import React, { useEffect } from 'react';
import { Button, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import OpenAI from 'openai';

const commonDirective = `
  코드를 읽어들인 뒤, 아래 지시사항에 따라 코드를 수정하고, 코드블럭에 답변을 작성하세요.
  - 지시사항에 없는 기능, 코드는 작성하지 말것
  - 기존 코드의 양식을 지키며 코드를 작성할 것
  - 답변은 반드시 코드블럭으로만 제공할 것
`;

const sampleDirective = `
  Todo 컴포넌트에 다음기능 추가: 리셋 기능 추가
`;

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const EditorPage = () => {
  const [prompt, setPrompt] = React.useState(sampleDirective);
  const [response, setResponse] = React.useState('');
  const [selectedFiles, setSelectedFiles] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    // localStorage에서 선택된 파일 정보 가져오기
    const files = JSON.parse(localStorage.getItem('selectedFiles') || '[]');
    setSelectedFiles(files);
  }, []);

  const readFileContent = async (filePath) => {
    try {
      const handle = await window.showDirectoryPicker();
      const parts = filePath.split('/');
      let currentHandle = handle;

      for (const part of parts) {
        if (!currentHandle) break;
        currentHandle = await currentHandle.getDirectoryHandle(part, { create: false }).catch(() => null);
      }

      if (currentHandle) {
        const fileHandle = await currentHandle.getFileHandle(parts[parts.length - 1]);
        const file = await fileHandle.getFile();
        return await file.text();
      }
    } catch (error) {
      console.error(`Error reading file: ${filePath}`, error);
      return '';
    }
  };

  const handlePromptSubmit = async () => {
    try {
      setIsLoading(true);

      // 모든 파일 내용 읽기
      const fileContentsPromises = selectedFiles.map(async (file) => {
        console.log('### file.url', file.url)
        // TODO: nodejs 사용해야할듯
        const content = await readFileContent(file.url);
        console.log('#### content', content)
        return `\n\n--- File: ${file.fileName} ---\n${content}`;
      });

      const fileContents = await Promise.all(fileContentsPromises);

      // 파일 내용 + 지시사항 결합
      const fullPrompt = `${commonDirective}\n${fileContents.join('\n')}\n${prompt}`;
      console.log('######', fullPrompt)
      return;
      // GPT 호출
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: fullPrompt }],
      });

      setResponse(completion.choices[0].message.content || '');
    } catch (error) {
      console.error('Error fetching GPT response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearStorage = () => {
    localStorage.clear();
    message.success('storage has cleared');
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>GPT Prompt Test</h2>
      <Button
        onClick={clearStorage}
      >clear storage</Button>
      <div>
        <h3>Selected Files:</h3>
        <ul>
          {selectedFiles.map((file, index) => (
            <li key={index}>{`${file.fileName}`}</li>
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
