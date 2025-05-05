import {
  createConnection,
  createInMemoryFtKeyStore,
  createSingleSigAuthDescriptorRegistration,
  op,
  registerAccount,
  registrationStrategy,
} from '@chromia/ft4';
import chalk from 'chalk';
import { createClient } from 'postchain-client';
// import { ensureBuffer } from '../helpers/buffer';

const admin_kp = {
  privKey: Buffer.from('5FA2E76BCDE5C548C34D91E96B76C4FBDAE5C1410FA7F55CF6FE2D6B0A2D073A', 'hex'),
  pubKey: Buffer.from('033CBF397B79E38FFE68B9CD40B00C70785D9CCD8E1C9EA47674FA4091CA3BBADD', 'hex'),
};

async function main() {
  try {
    // create client
    const client = await createClient({
      nodeUrlPool: 'http://localhost:7740',
      blockchainRid: '63165DAD97E4010E4CA3DA3150440A2831D3256FD07DC7D78D0C1360257B69F2',
    });

    // create account with open stratergy
    const store = createInMemoryFtKeyStore(admin_kp);
    const connection = createConnection(client);
    const { session } = await registerAccount(
      connection.client,
      store,
      registrationStrategy.open(
        createSingleSigAuthDescriptorRegistration(['A', 'T'], store.id, null)
      )
    );

    console.log(
      chalk.green(
        `Account registered successfully! Account ID: ${session.account.id.toString('hex')}`
      )
    );

    const result123 = await session.call(op('initialize_underlying_asset_factory'));

    console.log('result123', result123);
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
