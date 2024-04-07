import { logger } from '../utils/logger';
import { getClient } from './client';

async function test(): Promise<void> {
  const openai = getClient();

  const response = await openai.chat.completions.create({
    model: 'ollama/phi',
    messages: [{ role: 'user', content: 'write a short poem' }],
  });

  logger.info(JSON.stringify(response));
}

test();
