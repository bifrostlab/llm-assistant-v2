import type { Command } from './command-utils/builder';
import askLLMCommand from './llm/ask.command';

export const commands: Command[] = [askLLMCommand];
