import type { Command } from './discord/command-builder';

import askLLMCommand from './ask-llm/command';
import reviewResumeCommand from './review-resume/command';

export const commands: Command[] = [askLLMCommand, reviewResumeCommand];
