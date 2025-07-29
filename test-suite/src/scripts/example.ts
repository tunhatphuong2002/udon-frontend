import { op } from '@chromia/ft4';
import chalk from 'chalk';
import { getClient } from '@clients/index';
import { registerAccountOpen } from '@common/operations/accounts';
import { admin_kp } from '../configs/key-pair';

// example to implement post-chain
async function main() {
  try {
    // create client
    const client = await getClient();
    // create account with open stratergy
    const session = await registerAccountOpen(client, admin_kp);
    console.log(
      chalk.green(
        `Account registered successfully! Account ID: ${session.account.id.toString('hex')}`
      )
    );
    // call operation with session
    const result = await session.call(op('initialize_underlying_asset_factory'));
    console.log('result', result);
  } catch (error) {
    console.log(chalk.red('error', error));
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(chalk.red('Fatal error:'), error);
    process.exit(1);
  });
