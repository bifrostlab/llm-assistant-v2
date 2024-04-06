import { Result } from 'oxide.ts';
import { deployGlobalCommands } from '../src/command-utils/deploy';
import { loadEnv } from '../src/utils/load-env';

async function deploy() {
  loadEnv();
  const token = process.env.TOKEN ?? '';
  const clientId = process.env.CLIENT_ID ?? '';

  console.log('[delete-global-commands]: Deleting global commands');
  const op = await Result.safe(
    deployGlobalCommands([], {
      token,
      clientId,
    })
  );
  if (op.isOk()) {
    console.log('[delete-global-commands]: Global commands deleted successfully');
    process.exit(0);
  }

  console.error('[delete-global-commands]: Cannot delete global commands', op.unwrapErr());
  process.exit(1);
}

deploy();
