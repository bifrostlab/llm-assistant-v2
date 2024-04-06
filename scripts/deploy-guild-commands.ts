import { Result } from 'oxide.ts';
import { deployGuildCommands } from '../src/command-utils/deploy';
import { commands } from '../src/commands';
import { getCurrentUnixTime } from '../src/utils/date';
import { loadEnv } from '../src/utils/load-env';

async function deploy() {
  loadEnv();
  const token = process.env.TOKEN ?? '';
  const clientId = process.env.CLIENT_ID ?? '';
  const guildId = process.env.GUILD_ID ?? '';

  console.log('[deploy-guild-commands]: Deploying guild commands');
  const op = await Result.safe(
    deployGuildCommands(commands, {
      token,
      clientId,
      guildId,
    })
  );
  if (op.isOk()) {
    console.log('[deploy-guild-commands]: Guild commands deployed successfully');
    process.exit(0);
  }

  console.error(`[deploy-guild-commands]: Cannot deploy guild commands. Timestamp ${getCurrentUnixTime()}`, op.unwrapErr());
  process.exit(1);
}

deploy();
