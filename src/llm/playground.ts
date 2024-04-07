import { Result } from 'oxide.ts';
import { logger } from '../utils/logger';
import { askQuestion } from './utils';

async function test(): Promise<void> {
  const response = await Result.safe(askQuestion('tinydolphin', 'What is the capital of Australia?'));
  if (response.isErr()) {
    logger.error(response.unwrapErr());
  }

  const data = response.unwrap();
  logger.info(data);
}

test();
