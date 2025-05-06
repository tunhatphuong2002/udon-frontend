import { getClient } from '../clients';
import { getSession } from '../helpers/index';
import { admin_kp } from '../configs/key-pair';
import { registerAccountOpen } from '../common/operations/accounts';
import {
  burnAssetOp,
  mintAssetOp,
  registerAssetOp,
  // transferAssetOp,
} from '../common/operations/assets';

async function main() {
  try {
    // initialize the client
    const client = await getClient();
    console.log('Client initialized');

    // create account and get session
    await registerAccountOpen(client, admin_kp);
    console.log('Account registered');

    const session = await getSession(client, admin_kp);
    console.log('Session obtained:', session.account.id.toString('hex'));

    // register asset
    await registerAssetOp(session, 'USDC', 'USDC', 6, 'https://example.com/usdc.png');
    console.log('Asset registered');

    // mint asset
    const mintAmount = 1000000;
    await mintAssetOp(session, session.account.id.toString('hex'), 'USDC', mintAmount);
    console.log(`Minted ${mintAmount} USDC`);

    // get asset and balance
    const assets = await session.getAssetsBySymbol('USDC');
    console.log('USDC asset info:', assets.data[0]);

    const balances = await session.account.getBalances();
    console.log('Account balances:', balances);

    // burn asset
    await burnAssetOp(session, 'USDC', 6);
    console.log('Asset burned');

    // get transaction history
    const history = await session.account.getTransferHistory();
    console.log('Transaction history:', history);
  } catch (error) {
    console.error('Error in main:', error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
