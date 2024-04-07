import { Result } from 'oxide.ts';
import { download } from '../src/llm/resume-utils';
import { askQuestion } from '../src/llm/utils';
import { logger } from '../src/utils/logger';

async function test(): Promise<void> {
  const response = await Result.safe(askQuestion('tinydolphin', 'What is the capital of Australia?'));
  if (response.isErr()) {
    logger.error(response.unwrapErr());
  }

  const data = response.unwrap();
  logger.info(data);
}

// test();

async function go() {
  await download('1W8wHR_OqRTr7N9A674tbNWtObN6RvwmE', '12345');
}
go();
