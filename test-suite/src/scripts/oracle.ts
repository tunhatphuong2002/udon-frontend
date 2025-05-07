import chalk from 'chalk';
// import { registerAccountOpen } from '../common/operations/accounts';
import { createClient } from 'postchain-client';
// import { getSession } from '@/helpers';
import { createInMemoryFtKeyStore, createKeyStoreInteractor } from '@chromia/ft4';

const admin_kp = {
  privKey: Buffer.from('5FA2E76BCDE5C548C34D91E96B76C4FBDAE5C1410FA7F55CF6FE2D6B0A2D073A', 'hex'),
  pubKey: Buffer.from('033CBF397B79E38FFE68B9CD40B00C70785D9CCD8E1C9EA47674FA4091CA3BBADD', 'hex'),
};

// example to implement post-chain
async function main() {
  try {
    const directoryNodeUrlPool = [
      'https://node0.testnet.chromia.com:7740',
      'https://node1.testnet.chromia.com:7740',
      'https://node2.testnet.chromia.com:7740',
      'https://node3.testnet.chromia.com:7740',
    ];
    const blockchainRid = '21A450399A8A35D141940770971531EAC33B7FFD6AB517B6144B02D216138782';
    // create client
    const client = await createClient({
      directoryNodeUrlPool: directoryNodeUrlPool,
      blockchainRid: blockchainRid,
    });
    // create account with open stratergy
    // const session = await registerAccountOpen(client, admin_kp);
    // console.log(
    //   chalk.green(
    //     `Account registered successfully! Account ID: ${session.account.id.toString('hex')}`
    //   )
    // );

    const store = createInMemoryFtKeyStore(admin_kp);

    const { getSession } = createKeyStoreInteractor(client, store);

    const session = await getSession(
      '99e1a20c489b91d1c5af46179f69dc4d252abdf9b3e9f428f4f4670dd8d9e670'
    );
    // call operation with session
    const result = await session.query('get_latest_price', { asset: 'BTCUSD' });
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
