import chalk from 'chalk';
import { getTransferHistoryEntriesFiltered } from '@chromia/ft4';
import { createClient } from 'postchain-client';

async function initSupply() {
  try {
    console.log(chalk.bold.cyan('=== Starting Supply Initialization Process ==='));

    // Get client and setup sessions
    console.log(chalk.blue('🔄 Setting up client and sessions...'));
    const client = await createClient({
      directoryNodeUrlPool: 'https://node0.testnet.chromia.com:7740',
      blockchainRid: '090BCD47149FBB66F02489372E88A454E7A5645ADDE82125D40DF1EF0C76F874',
    });
    // const adminSession = await getSessionOrRegister(client, admin_kp);

    // const underlyingAssetResult = await adminSession.getAssetsBySymbol('tCHR');
    // console.log('underlyingAssetResult', underlyingAssetResult);

    // const record_staking = await client.query(
    //   'get_staking_positions_max_unstaked_st_asset_amount',
    //   {
    //     user_id: Buffer.from(
    //       'E6BDEC98482AA1837D28E71DAE487905809BAE2B6F35B827016249C84566FCD3',
    //       'hex'
    //     ),
    //     underlying_asset_id: underlyingAssetResult.data[0].id,
    //   }
    // );
    // console.log('record_staking', record_staking);

    // const record_unstaking = await client.query(
    //   'get_unstaking_positions_max_unstaked_st_asset_amount',
    //   {
    //     user_id: Buffer.from(
    //       'E6BDEC98482AA1837D28E71DAE487905809BAE2B6F35B827016249C84566FCD3',
    //       'hex'
    //     ),
    //     underlying_asset_id: underlyingAssetResult.data[0].id,
    //   }
    // );
    // console.log('record_unstaking', record_unstaking);

    // const get_max_unstaked_st_asset_amount = await client.query(
    //   'get_max_unstaked_st_asset_amount',
    //   {
    //     user_id: Buffer.from(
    //       'E6BDEC98482AA1837D28E71DAE487905809BAE2B6F35B827016249C84566FCD3',
    //       'hex'
    //     ),
    //     underlying_asset_id: underlyingAssetResult.data[0].id,
    //   }
    // );
    // console.log('get_max_unstaked_st_asset_amount', get_max_unstaked_st_asset_amount);

    // const crossChainHistory = await getCrosschainTransferHistoryEntriesFiltered(
    //   client,
    //   {
    //     accountIds: [
    //       Buffer.from('8C907209E5389024997C1E158F58FB7EE040086184430998175DD14E3ED6972D', 'hex'),
    //     ],
    //     assetIds: [
    //       Buffer.from('9EF73A786A66F435B3B40E72F5E9D85A4B09815997E087C809913E1E7EC686B4', 'hex'),
    //     ],
    //   },
    //   null,
    //   null
    // );

    // for (const history of crossChainHistory.data) {
    //   // console.log(
    //   //   'history',
    //   //   history.accountId.toString('hex'),
    //   //   history.assetId.toString('hex'),
    //   //   history.transactionId.toString('hex')
    //   // );
    //   const resultTx = await client.getTransactionStatus(history.transactionId);
    //   console.log(resultTx, resultTx);
    // }
    // console.log('crossChainHistory', crossChainHistory);

    const transferHistory = await getTransferHistoryEntriesFiltered(
      client,
      {
        accountIds: [
          Buffer.from('8C907209E5389024997C1E158F58FB7EE040086184430998175DD14E3ED6972D', 'hex'),
        ],
        assetIds: [
          Buffer.from('9EF73A786A66F435B3B40E72F5E9D85A4B09815997E087C809913E1E7EC686B4', 'hex'),
        ],
      },
      null,
      null
    );

    console.log('transferHistory', transferHistory);

    for (const history of transferHistory.data) {
      console.log(
        'history',
        history.rowid,
        history.transactionId.toString('hex'),
        history.delta.value.toString()
      );
      const resultTx = await client.getTransactionStatus(history.transactionId);
      console.log(resultTx, resultTx);
    }
    console.log('transferHistory', transferHistory);
  } catch (error) {
    console.error(chalk.bold.red('❌❌❌ ERROR IN INIT SUPPLY ❌❌❌'));
    console.error(chalk.red(error));
  }
}

// Execute the script
initSupply().catch(error => console.error(chalk.red('Unhandled error:'), error));
