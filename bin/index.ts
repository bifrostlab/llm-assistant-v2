import { InteractionType } from 'discord-api-types/v10';
import { Result } from 'oxide.ts';
import { deployGlobalCommands } from '../src/command-utils/deploy';
import { commands } from '../src/commands';
import { getClient as getDiscordClient } from '../src/discord/client';
import { loadEnv } from '../src/utils/load-env';

async function main() {
  loadEnv();
  console.log('[main]: STARTING BOT');
  const token = process.env.TOKEN ?? '';
  const client = await getDiscordClient({ token });

  if (!client.user) throw new Error('Something went wrong!');
  console.log(`[main]: Logged in as ${client.user.tag}!`);

  if (process.env.NODE_ENV === 'production') {
    // This should only be run once during the bot startup in production.
    // For development usage, please use `pnpm deploy:command`
    console.log('[main]: Deploying global commands');
    const op = await Result.safe(
      deployGlobalCommands(commands, {
        token,
        clientId: client.user.id,
      })
    );
    if (op.isErr()) {
      console.error('[main]: Cannot deploy global commands', op.unwrapErr());
      process.exit(1);
    }
    console.log('[main]: Successfully deployed global commands');
  }

  client.on('interactionCreate', async (interaction) => {
    try {
      const isCommand = interaction.isChatInputCommand();
      if (isCommand) {
        const { commandName } = interaction;
        console.log(`[main]: RECEIVED COMMAND. COMMAND: ${commandName}`);
        const command = commands.find((cmd) => cmd.data.name === commandName);
        return await command?.execute(interaction);
      }

      const isAutocomplete = interaction.type === InteractionType.ApplicationCommandAutocomplete;
      if (isAutocomplete) {
        const { commandName } = interaction;
        console.log(`[main]: RECEIVED AUTOCOMPLETE. COMMAND: ${commandName}`);
        const command = commands.find((cmd) => cmd.data.name === commandName);
        return await command?.autocomplete?.(interaction);
      }
    } catch (error) {
      console.error(`[main]: ERROR HANDLING INTERACTION, ERROR: ${error}`);
    }
  });
}

main();
process.on('SIGTERM', () => process.exit());
