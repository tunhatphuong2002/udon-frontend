import { admin_kp, test_fee_kp } from '../../configs/key-pair';
// import { registerAccountOpen } from '../common/operations/accounts';
import { getClient } from '../../clients';
import chalk from 'chalk';
// import { formatUnits, parseUnits } from 'ethers/lib/utils';
// import { TOKENS_MAINNET } from '../../configs/tokens';
import { getSessionOrRegister, getSessionOrRegisterEVM } from '../../helpers';
import { createAmount, op } from '@chromia/ft4';

async function initSupply() {
  try {
    console.log(chalk.bold.cyan('=== Starting Supply Initialization Process ==='));

    // Get client and setup sessions
    console.log(chalk.blue('🔄 Setting up client and sessions...'));
    const client = await getClient();
    const adminSession = await getSessionOrRegister(client, admin_kp);
    const testFeeSession = await getSessionOrRegisterEVM(client, test_fee_kp);

    const underlyingAssetResult = await adminSession.getAssetsBySymbol('tCHR');
    console.log('underlyingAssetResult', underlyingAssetResult);

    await adminSession.call(
      op('grant_role', 'FUNDS_ADMIN', adminSession.account.id, admin_kp.pubKey)
    );

    const fee_acc = await client.query('get_fee_collector_account_id');
    console.log('fee_acc', fee_acc);

    const total_fees = await client.query('get_total_fees', {
      asset_id: underlyingAssetResult.data[0].id,
    });
    console.log('total_fees', total_fees);

    // testFeeSession can not withdraw fee?
    await adminSession.call(
      op(
        'withdraw_fees',
        testFeeSession.account.id,
        underlyingAssetResult.data[0].id,
        createAmount(600, 0).value
      )
    );
  } catch (error) {
    console.error(chalk.bold.red('❌❌❌ ERROR IN INIT SUPPLY ❌❌❌'));
    console.error(chalk.red(error));
  }
}

// Execute the script
initSupply().catch(error => console.error(chalk.red('Unhandled error:'), error));
