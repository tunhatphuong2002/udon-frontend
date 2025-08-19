import { getClient } from '../../clients';
import chalk from 'chalk';

async function setFee() {
  try {
    console.log(chalk.bold.cyan('=== Starting Set Fee Process ==='));

    // Get client and setup sessions
    console.log(chalk.blue('🔄 Setting up client and sessions...'));
    const client = await getClient();
    // const adminSession = await getSessionOrRegister(client, admin_udon_testnet_kp);

    const result = (await client.query('get_max_borrow_amount', {
      user_id: Buffer.from(
        '1F33EFB832330D8D834BCA1DBCA446DBC79C3150F9A07E6D9C9C35DC95E5E96B',
        'hex'
      ),
      asset_id: Buffer.from(
        '09BB9BC4AA499B5352EE7B17229A4128F9B4F12E463FAB4AA178ACD3E5AD9B0F',
        'hex'
      ),
    })) as unknown as number;

    console.log('result', result);
  } catch (error) {
    console.error(chalk.bold.red('❌❌❌ ERROR IN SET FEE ❌❌❌'));
    console.error(chalk.red(error));
  }
}

// Execute the script
setFee().catch(error => console.error(chalk.red('Unhandled error:'), error));
