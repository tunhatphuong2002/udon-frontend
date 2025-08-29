import { getSessionOrRegister } from '../../helpers';
import { getClient } from '../../clients';
import chalk from 'chalk';
import { admin_udon_testnet_kp } from '../../configs/key-pair';
import { op } from '@chromia/ft4';

async function setFee() {
  try {
    console.log(chalk.bold.cyan('=== Starting Set Fee Process ==='));

    // Get client and setup sessions
    console.log(chalk.blue('🔄 Setting up client and sessions...'));
    const client = await getClient();
    const adminSession = await getSessionOrRegister(client, admin_udon_testnet_kp);
    // const adminSession = await getSessionOrRegister(client, admin_udon_testnet_kp);
    await adminSession.call(
      op(
        'set_reserve_borrowing',
        Buffer.from('51493CDDB86197225F63F3C6CB8E37515F6983244FCD30CC3AA142CDE1C4C32A', 'hex'),
        false
      )
    );
    console.log(chalk.green(`✅ Set field for set_reserve_borrowing`));
  } catch (error) {
    console.error(chalk.bold.red('❌❌❌ ERROR IN SET FEE ❌❌❌'));
    console.error(chalk.red(error));
  }
}

// Execute the script
setFee().catch(error => console.error(chalk.red('Unhandled error:'), error));
