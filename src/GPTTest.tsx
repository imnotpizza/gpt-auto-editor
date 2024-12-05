import OpenAI from 'openai';
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
  useEffect(() => {}, []);

  const callApi = async () => {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: 'what is 1+1' }],
    });

    console.log('completion', completion);
  };

  return (
    <div>
      <p>chatgpt-api-test</p>
      <button onClick={callApi}>call</button>
    </div>
  );
}
