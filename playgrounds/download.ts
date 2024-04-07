import { download } from '../src/review-resume/downloader';
import { getOutputFileName } from '../src/review-resume/utils';

async function downloadGDrive() {
  const output = getOutputFileName('gdrive');
  await download('https://drive.google.com/file/d/1W8wHR_OqRTr7N9A674tbNWtObN6RvwmE/view?usp=sharing', output);
}
downloadGDrive();

async function downloadGeneric() {
  const output = getOutputFileName('generic');
  await download('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', output);
}
downloadGeneric();
