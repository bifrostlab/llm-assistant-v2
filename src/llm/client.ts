import 'openai/shims/web';

import { OpenAI } from 'openai';

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
