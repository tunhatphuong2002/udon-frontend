import { admin_kp } from '../../configs/key-pair';
import { getClient } from '../../clients';
import chalk from 'chalk';
import { getSessionOrRegister } from '../../helpers';

async function initSupply() {
  try {
    console.log(chalk.bold.cyan('=== Starting Supply Initialization Process ==='));

    // Get client and setup sessions
    console.log(chalk.blue('🔄 Setting up client and sessions...'));
    const client = await getClient();
    const adminSession = await getSessionOrRegister(client, admin_kp);

    const underlyingAssetResult = await adminSession.getAssetsBySymbol('tCHR');
    console.log('underlyingAssetResult', underlyingAssetResult);

    const record_staking = await client.query(
      'get_staking_positions_max_unstaked_st_asset_amount',
      {
        user_id: Buffer.from(
          'E6BDEC98482AA1837D28E71DAE487905809BAE2B6F35B827016249C84566FCD3',
          'hex'
        ),
        underlying_asset_id: underlyingAssetResult.data[0].id,
      }
    );
    console.log('record_staking', record_staking);

    const record_unstaking = await client.query(
      'get_unstaking_positions_max_unstaked_st_asset_amount',
      {
        user_id: Buffer.from(
          'E6BDEC98482AA1837D28E71DAE487905809BAE2B6F35B827016249C84566FCD3',
          'hex'
        ),
        underlying_asset_id: underlyingAssetResult.data[0].id,
      }
    );
    console.log('record_unstaking', record_unstaking);

    const get_max_unstaked_st_asset_amount = await client.query(
      'get_max_unstaked_st_asset_amount',
      {
        user_id: Buffer.from(
          'E6BDEC98482AA1837D28E71DAE487905809BAE2B6F35B827016249C84566FCD3',
          'hex'
        ),
        underlying_asset_id: underlyingAssetResult.data[0].id,
      }
    );
    console.log('get_max_unstaked_st_asset_amount', get_max_unstaked_st_asset_amount);
  } catch (error) {
    console.error(chalk.bold.red('❌❌❌ ERROR IN INIT SUPPLY ❌❌❌'));
    console.error(chalk.red(error));
  }
}

// Execute the script
initSupply().catch(error => console.error(chalk.red('Unhandled error:'), error));
