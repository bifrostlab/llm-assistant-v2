import { OpenAI } from 'openai';
import 'openai/shims/web';

let client: OpenAI | null = null;

export function getClient(): OpenAI {
  if (!client) {
    client = new OpenAI({
      baseURL: 'http://0.0.0.0:4000',
      apiKey: 'FAKE',
    });
  }

  return client;
}
