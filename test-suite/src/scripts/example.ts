import { op } from '@chromia/ft4';
import chalk from 'chalk';
import { getClient } from '@clients/index';
import { registerAccountOpen } from '@common/operations/accounts';

const admin_kp = {
  privKey: Buffer.from('5FA2E76BCDE5C548C34D91E96B76C4FBDAE5C1410FA7F55CF6FE2D6B0A2D073A', 'hex'),
  pubKey: Buffer.from('033CBF397B79E38FFE68B9CD40B00C70785D9CCD8E1C9EA47674FA4091CA3BBADD', 'hex'),
};

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
