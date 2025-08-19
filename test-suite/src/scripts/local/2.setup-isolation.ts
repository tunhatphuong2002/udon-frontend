import { op } from '@chromia/ft4';
import { admin_udon_testnet_kp } from '../../configs/key-pair';
import { getClient } from '../../clients';
import chalk from 'chalk';
import { TOKENS } from '../../configs/tokens';
import { getSessionOrRegister } from '../../helpers';

async function setFee() {
  try {
    console.log(chalk.bold.cyan('=== Starting Set Fee Process ==='));

    // Get client and setup sessions
    console.log(chalk.blue('🔄 Setting up client and sessions...'));
    const client = await getClient();
    const adminSession = await getSessionOrRegister(client, admin_udon_testnet_kp);

    const token = TOKENS.find(t => t.symbol === 'D');
    console.log(chalk.blue(`🔄 Setting fee for ${token.symbol}...`));

    const underlyingAssetResult = await adminSession.getAssetsBySymbol(token.symbol);
    const underlyingAssetId = underlyingAssetResult.data[0].id;
    console.log(chalk.green(`✅ ${token.symbol} created:`), chalk.yellow(`(${underlyingAssetId})`));

    await adminSession.call(op('set_borrowable_in_isolation_op', underlyingAssetId, true));
    console.log(chalk.green(`✅ ${token.symbol} borrowable set to true`));

    await adminSession.call(op('set_debt_ceiling_op', underlyingAssetId, 0));
    console.log(chalk.green(`✅ ${token.symbol} debt ceiling set to 0`));
  } catch (error) {
    console.error(chalk.bold.red('❌❌❌ ERROR IN SET FEE ❌❌❌'));
    console.error(chalk.red(error));
  }
}

// Execute the script
setFee().catch(error => console.error(chalk.red('Unhandled error:'), error));
