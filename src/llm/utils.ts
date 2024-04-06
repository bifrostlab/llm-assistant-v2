import 'openai/shims/web';
import { OpenAI } from 'openai';

async function test() {
  const openai = new OpenAI({
    baseURL: 'http://0.0.0.0:4000',
    apiKey: 'FAKE'
  })

  const response = await openai.chat.completions.create({
    model: 'ollama/phi',
    messages: [{"role": "user", "content": "write a short poem"}],
  })

  console.log(JSON.stringify(response))
}

test()
