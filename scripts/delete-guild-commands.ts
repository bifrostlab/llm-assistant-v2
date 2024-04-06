import { Result } from 'oxide.ts';
import { deployGuildCommands } from '../src/command-utils/deploy';
import { getCurrentUnixTime } from '../src/utils/date';
import { loadEnv } from '../src/utils/load-env';

async function deploy() {
  loadEnv();
  const token = process.env.TOKEN ?? '';
  const clientId = process.env.CLIENT_ID ?? '';
  const guildId = process.env.GUILD_ID ?? '';

  console.log('[delete-guild-commands]: Deleting guild commands');
  const op = await Result.safe(
    deployGuildCommands([], {
      token,
      clientId,
      guildId,
    })
  );
  if (op.isOk()) {
    console.info('[delete-guild-commands]: Guild commands deleted successfully');
    process.exit(0);
  }

  console.error(`[delete-guild-commands]: Cannot delete guild commands. Timestamp ${getCurrentUnixTime()}`, op.unwrapErr());
  process.exit(1);
}

deploy();
