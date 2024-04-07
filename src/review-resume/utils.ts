import fs from 'node:fs';
import path from 'node:path';
import { logger } from '../utils/logger';

export function getOutputFileName(userId: string): string {
  return path.resolve(__dirname, 'resumes', `resume-${userId}.pdf`);
}

export function deleteOutputFile(userId: string): void {
  logger.info(`[deleteOutputFile]: Deleting output file for user ${userId}`);
  const filePath = getOutputFileName(userId);
  fs.rmSync(filePath);
}
