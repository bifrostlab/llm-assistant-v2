import type {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js';

export type CommandHandler = (interaction: ChatInputCommandInteraction) => Promise<void>;
export type AutocompleteHandler = (autocomplete: AutocompleteInteraction) => Promise<void>;

export interface Command {
  data: Omit<SlashCommandBuilder, 'addSubcommandGroup' | 'addSubcommand'> | SlashCommandSubcommandsOnlyBuilder;
  execute: CommandHandler;
  autocomplete?: AutocompleteHandler;
}

export interface Subcommand {
  data: SlashCommandSubcommandBuilder | ((subcommandGroup: SlashCommandSubcommandBuilder) => SlashCommandSubcommandBuilder);
  execute: CommandHandler;
}
