import { getClient } from './client';

async function test() {
  const openai = getClient();

  const response = await openai.chat.completions.create({
    model: 'ollama/phi',
    messages: [{ role: 'user', content: 'write a short poem' }],
  });

  console.log(JSON.stringify(response));
}

test();
