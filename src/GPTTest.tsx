import { Button } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import OpenAI from 'openai';
import React from 'react';
import { useEffect } from 'react';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

/**
 *
 *
 *
 *
 *
 *
 */
export default function GPTTest() {
  const [prompt, setPrompt] = React.useState('');
  const [response, setResponse] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [state, setState] = React.useState<'success' | 'error'>();
  useEffect(() => {}, []);

  const callApi = async () => {
    try {
      setIsLoading(true);
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
      });
      setResponse(completion.choices[0].message.content || '');
      setState('success');
    } catch (e) {
      console.error(e);
      setState('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <p>chatgpt-api-test: status: {state}</p>
      <TextArea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="프롬프트 입력"
      />
      <Button loading={isLoading} onClick={callApi}>
        gpt 질문
      </Button>
      <div>
        <p>response</p>
        <TextArea style={{ height: 200 }} readOnly value={response} />
      </div>
    </div>
  );
}
