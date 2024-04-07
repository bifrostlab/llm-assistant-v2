import fs from 'node:fs';
import path from 'node:path';
import wretch from 'wretch';
import QueryStringAddon from 'wretch/addons/queryString';

// https://drive.google.com/file/d/<FILE_ID>/view?usp=sharing
// https://docs.google.com/uc?export=download&confirm=t&id=1<FILE_ID>
export async function download(id: string, userId: string) {
  const response = await wretch('https://docs.google.com/uc').addon(QueryStringAddon).query({ export: 'download', confirm: 't', id: id }).get().blob();
  console.log({ response });

  const filePath = getOutputFileName(userId);
  fs.writeFileSync(filePath, Buffer.from(new Uint8Array(await response.arrayBuffer())));
}

function getOutputFileName(userId: string) {
  return path.resolve(__dirname, 'resumes', `resume-${userId}.pdf`);
}

/**
 * Extracts the file ID from a Google Drive URL.
 */
function extractFileId(url: string) {
  const match = url.match(/\/d\/([^/]+)\//);
  return match ? match[1] : null;
}

function deleteOutputFile(userId: string) {
  const filePath = getOutputFileName(userId);
  fs.rmSync(filePath);
}
