import { Result } from 'oxide.ts';
import { askQuestion } from '../src/llm/utils';
import { download } from '../src/review-resume/downloader';
import { getOutputFileName } from '../src/review-resume/utils';
import { logger } from '../src/utils/logger';

async function ask(): Promise<void> {
  const response = await Result.safe(askQuestion('tinydolphin', 'What is the capital of Australia?'));
  if (response.isErr()) {
    logger.error(response.unwrapErr());
  }

  const data = response.unwrap();
  logger.info(data);
}

// ask();

async function downloadGDrive() {
  const output = getOutputFileName('gdrive');
  await download('https://drive.google.com/file/d/1W8wHR_OqRTr7N9A674tbNWtObN6RvwmE/view?usp=sharing', output);
}
// downloadGDrive();

async function downloadGeneric() {
  const output = getOutputFileName('generic');
  await download('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', output);
}
downloadGeneric();
