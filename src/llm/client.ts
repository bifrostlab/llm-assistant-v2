import { OpenAI } from 'openai';
import 'openai/shims/web';

export function getClient() {
  return new OpenAI({
    baseURL: 'http://0.0.0.0:4000',
    apiKey: 'FAKE',
  });
}
