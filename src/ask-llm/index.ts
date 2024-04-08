import { SlashCommandBuilder } from 'discord.js';
import type { Command, CommandHandler } from '../command-utils/builder';
import { selectModelAutocomplete } from '../llm/select-model-autocomplete';
import { SUPPORTED_MODELS, type SupportedModel, askQuestion } from '../llm/utils';
import { logger } from '../utils/logger';

const data = new SlashCommandBuilder()
  .setName('ask')
  .setDescription('Ask an LLM to answer anything')
  .addStringOption((option) => option.setName('model').setDescription('Choose an LLM model').setRequired(true).setAutocomplete(true))
  .addStringOption((option) => option.setName('question').setDescription('Enter your prompt').setRequired(true).setMinLength(10));

export const execute: CommandHandler = async (interaction) => {
  const model = interaction.options.getString('model', true).trim().toLowerCase();
  const question = interaction.options.getString('question', true).trim();
  logger.info(`[ask]: Asking ${model} model with prompt: ${question}`);

  const hasModel = SUPPORTED_MODELS.find((option) => option.toLowerCase() === model);
  if (!hasModel) {
    logger.info(`[ask]: Invalid model ${model}`);
    interaction.reply('Invalid model. Please choose from the available models.');
    return;
  }

  const answers = await askQuestion(model as SupportedModel, question);
  logger.info('[ask]: Got response from LLM', data);
  await answers.reduce(async (accum, chunk) => {
    await accum;
    await interaction.reply(chunk);
    return undefined;
  }, Promise.resolve(undefined));
};

const command: Command = {
  data,
  execute,
  autocomplete: selectModelAutocomplete,
};

export default command;
