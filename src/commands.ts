import type { Command } from './discord/command-builder';

import askLLMCommand from './ask-llm';
import reviewResumeCommand from './review-resume';

export const commands: Command[] = [askLLMCommand, reviewResumeCommand];
