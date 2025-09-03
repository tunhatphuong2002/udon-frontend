import { admin_kp } from '../../configs/key-pair';
// import { registerAccountOpen } from '../common/operations/accounts';
import { getClient } from '../../clients';
import chalk from 'chalk';
// import { formatUnits, parseUnits } from 'ethers/lib/utils';
// import { TOKENS_MAINNET } from '../../configs/tokens';
import { getSessionOrRegister } from '../../helpers';
import { createAmount, op } from '@chromia/ft4';
import { getCHRIdBuffer } from '../../helpers/crypto.mainnet';

async function initSupply() {
  try {
    console.log(chalk.bold.cyan('=== Starting Supply Initialization Process ==='));

    // Get client and setup sessions
    console.log(chalk.blue('🔄 Setting up client and sessions...'));
    const client = await getClient();
    const adminSession = await getSessionOrRegister(client, admin_kp);

    // testFeeSession can not withdraw fee?
    await adminSession.call(op('set_staking_fee', getCHRIdBuffer(), 30n));

    // testFeeSession can not withdraw fee?
    await adminSession.call(op('set_unstaking_fee', getCHRIdBuffer(), 30n));

    await adminSession.call(op('set_creation_ec_fee', getCHRIdBuffer(), createAmount(10, 6).value));
  } catch (error) {
    console.error(chalk.bold.red('❌❌❌ ERROR IN INIT SUPPLY ❌❌❌'));
    console.error(chalk.red(error));
  }
}

// Execute the script
initSupply().catch(error => console.error(chalk.red('Unhandled error:'), error));
