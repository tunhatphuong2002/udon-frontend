import { admin_udon_testnet_kp } from '../../configs/key-pair';
// import { registerAccountOpen } from '../common/operations/accounts';
import { getClient } from '../../clients';
import chalk from 'chalk';
// import { formatUnits, parseUnits } from 'ethers/lib/utils';
// import { TOKENS_MAINNET } from '../../configs/tokens';
import { getSessionOrRegister } from '../../helpers';
import { op } from '@chromia/ft4';

async function initSupply() {
  try {
    console.log(chalk.bold.cyan('=== Starting Supply Initialization Process ==='));

    // Get client and setup sessions
    console.log(chalk.blue('🔄 Setting up client and sessions...'));
    const client = await getClient();
    const adminSession = await getSessionOrRegister(client, admin_udon_testnet_kp);

    // testFeeSession can not withdraw fee?
    await adminSession.call(
      op(
        'set_staking_fee',
        Buffer.from('92A82246ED3F21FA13EBCDE7067AF492D0B1B462300879832A834F7C687A716D', 'hex'),
        30n
      )
    );

    // testFeeSession can not withdraw fee?
    await adminSession.call(
      op(
        'set_unstaking_fee',
        Buffer.from('92A82246ED3F21FA13EBCDE7067AF492D0B1B462300879832A834F7C687A716D', 'hex'),
        30n
      )
    );
  } catch (error) {
    console.error(chalk.bold.red('❌❌❌ ERROR IN INIT SUPPLY ❌❌❌'));
    console.error(chalk.red(error));
  }
}

// Execute the script
initSupply().catch(error => console.error(chalk.red('Unhandled error:'), error));
