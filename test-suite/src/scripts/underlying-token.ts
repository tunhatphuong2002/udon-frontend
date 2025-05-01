import { getClient } from '../clients';
import { getSession } from '../helpers';
import {
  admin_kp,
  signatureProviderAdmin,
  signatureProviderUserA,
  user_a_kp,
  user_b_kp,
} from '../configs/key-pair';
import { registerAccountOpen } from '../common/operations/accounts';
import { getTransactionHistory } from '../common/operations/assets';
import chalk from 'chalk';
import { Session } from '@chromia/ft4';
import { IClient } from 'postchain-client';
import { ensureBuffer } from '../helpers/buffer';

interface TestEnvironment {
  adminSession: Session;
  userASession: Session;
  userBSession: Session;
  client: IClient;
}

const initializeACL = async (client: IClient) => {
  const { status, statusCode, transactionRid } = await client.signAndSendUniqueTransaction(
    {
      operations: [
        {
          name: 'initialize',
          args: [ensureBuffer(admin_kp.pubKey)],
        },
      ],
      signers: [signatureProviderAdmin.pubKey],
    },
    signatureProviderAdmin
  );

  console.log('status', status);
  console.log('statusCode', statusCode);
  console.log('transactionRid', transactionRid);
};

const grantPoolAdminRole = async (client: IClient, account: Buffer) => {
  const { status, statusCode, transactionRid } = await client.signAndSendUniqueTransaction(
    {
      operations: [
        {
          name: 'grant_role',
          args: ['POOL_ADMIN_ROLE', ensureBuffer(account), ensureBuffer(admin_kp.pubKey)],
        },
      ],
      signers: [signatureProviderAdmin.pubKey],
    },
    signatureProviderAdmin
  );

  console.log('status', status);
  console.log('statusCode', statusCode);
  console.log('transactionRid', transactionRid);
};

async function setupTestEnvironment(): Promise<TestEnvironment> {
  console.log(chalk.blue('Setting up test environment...'));

  const client = await getClient();

  // Register admin account
  await registerAccountOpen(client, admin_kp);
  const adminSession = await getSession(client, admin_kp);
  console.log(chalk.green('Admin account registered:', adminSession.account.id.toString('hex')));

  // Register user A account
  await registerAccountOpen(client, user_a_kp);
  const userASession = await getSession(client, user_a_kp);
  console.log(chalk.green('User A account registered:', userASession.account.id.toString('hex')));

  // Register user B account
  await registerAccountOpen(client, user_b_kp);
  const userBSession = await getSession(client, user_b_kp);
  console.log(chalk.green('User B account registered:', userBSession.account.id.toString('hex')));

  // Initialize ACL module with pool_admin
  await initializeACL(client);

  // Grant POOL_ADMIN_ROLE to pool_admin account
  await grantPoolAdminRole(client, adminSession.account.id);

  return { adminSession, userASession, userBSession, client };
}

async function testCreateAndQueryAsset(adminSession: Session, client: IClient) {
  console.log(chalk.blue('\nTesting asset creation and querying...'));

  const assetName = 'Test Token';
  const assetSymbol = 'TT';
  const decimals = 6;
  const iconUrl = 'http://example.com/icon.png';

  // Register asset
  // await registerAssetOp(adminSession, assetName, assetSymbol, decimals, iconUrl);
  const { status, statusCode, transactionRid } = await client.signAndSendUniqueTransaction(
    {
      operations: [
        {
          name: 'create_underlying_asset',
          args: [assetName, assetSymbol, decimals, iconUrl],
        },
      ],
      signers: [signatureProviderAdmin.pubKey],
    },
    signatureProviderAdmin
  );

  console.log('status', status);
  console.log('statusCode', statusCode);
  console.log('transactionRid', transactionRid);

  // Query asset
  const assets = await adminSession.getAssetsBySymbol(assetSymbol);
  console.log(chalk.green('Asset created:', assets.data[0]));
}

async function testMintBurnBalance(adminSession: Session, userASession: Session, client: IClient) {
  console.log(chalk.blue('\nTesting mint, burn, and balance operations...'));

  const assetName = 'MintCoin';
  const assetSymbol = 'MC';
  const decimals = 8;
  const iconUrl = 'http://example.com/icon.png';

  // Register asset
  const { status, statusCode, transactionRid } = await client.signAndSendUniqueTransaction(
    {
      operations: [
        {
          name: 'create_underlying_asset',
          args: [assetName, assetSymbol, decimals, iconUrl],
        },
      ],
      signers: [signatureProviderAdmin.pubKey],
    },
    signatureProviderAdmin
  );

  console.log('status', status);
  console.log('statusCode', statusCode);
  console.log('transactionRid', transactionRid);

  // Get initial balance
  const initialBalances = await userASession.account.getBalances();
  console.log(chalk.yellow('Initial balances:', initialBalances));

  // Mint assets to User A
  const mintAmount = 100_000_000_00; // 100 MC with 8 decimals
  // await mintAssetOp(adminSession, userASession.account.id.toString('hex'), assetSymbol, mintAmount);

  const assets = await userASession.getAssetsBySymbol(assetSymbol);

  const assetId = assets.data[0].id;

  console.log(assetId, 'assetId');

  const {
    status: status2,
    statusCode: statusCode2,
    transactionRid: transactionRid2,
  } = await client.signAndSendUniqueTransaction(
    {
      operations: [
        {
          name: 'mint_underlying_asset',
          args: [ensureBuffer(userASession.account.id), mintAmount, assetId],
        },
      ],
      signers: [signatureProviderAdmin.pubKey],
    },
    signatureProviderAdmin
  );
  console.log('Result mint amount of user A:');
  console.log('status2', status2);
  console.log('statusCode2', statusCode2);
  console.log('transactionRid', transactionRid2);

  // Check balance after mint
  const balancesAfterMint = await userASession.account.getBalances();
  console.log(chalk.green('Balances after mint:', balancesAfterMint));

  // Burn some assets
  // await burnAssetOp(userASession, assetSymbol, decimals);
  const {
    status: status3,
    statusCode: statusCode3,
    transactionRid: transactionRid3,
  } = await client.signAndSendUniqueTransaction(
    {
      operations: [
        {
          name: 'burn_underlying_asset',
          args: [ensureBuffer(userASession.account.id), mintAmount, assetId],
        },
      ],
      signers: [signatureProviderAdmin.pubKey],
    },
    signatureProviderAdmin
  );
  console.log('Result mint amount of user A:');
  console.log('status3', status3);
  console.log('statusCode3', statusCode3);
  console.log('transactionRid3', transactionRid3);

  // Check final balance
  const finalBalances = await userASession.account.getBalances();
  console.log(chalk.green('Final balances:', finalBalances));
}

async function testTransferAsset(
  adminSession: Session,
  userASession: Session,
  userBSession: Session,
  client: IClient
) {
  console.log(chalk.blue('\nTesting asset transfer...'));

  const assetName = 'TransferCoin';
  const assetSymbol = 'TRC';
  const decimals = 6;
  const iconUrl = 'http://example.com/icon.png';

  // Register asset
  const { status, statusCode, transactionRid } = await client.signAndSendUniqueTransaction(
    {
      operations: [
        {
          name: 'create_underlying_asset',
          args: [assetName, assetSymbol, decimals, iconUrl],
        },
      ],
      signers: [signatureProviderAdmin.pubKey],
    },
    signatureProviderAdmin
  );

  console.log('Create asset result:');
  console.log('status:', status);
  console.log('statusCode:', statusCode);
  console.log('transactionRid:', transactionRid);

  // Mint to User A
  const initialAmount = 500_000_000; // 500 TRC
  const assets = await userASession.getAssetsBySymbol(assetSymbol);
  const assetId = assets.data[0].id;

  console.log('Asset ID:', assetId);

  const {
    status: mintStatus,
    statusCode: mintStatusCode,
    transactionRid: mintTransactionRid,
  } = await client.signAndSendUniqueTransaction(
    {
      operations: [
        {
          name: 'mint_underlying_asset',
          args: [ensureBuffer(userASession.account.id), initialAmount, assetId],
        },
      ],
      signers: [signatureProviderAdmin.pubKey],
    },
    signatureProviderAdmin
  );

  console.log('Mint result:');
  console.log('status:', mintStatus);
  console.log('statusCode:', mintStatusCode);
  console.log('transactionRid:', mintTransactionRid);

  // Check initial balances
  console.log(chalk.yellow('Initial balances:'));
  console.log('User A:', await userASession.account.getBalances());
  console.log('User B:', await userBSession.account.getBalances());

  // Transfer from A to B
  const transferAmount = 200_000_000; // 200 TRC
  const {
    status: transferStatus,
    statusCode: transferStatusCode,
    transactionRid: transferTransactionRid,
  } = await client.signAndSendUniqueTransaction(
    {
      operations: [
        {
          name: 'transfer_underlying_asset',
          args: [
            ensureBuffer(userASession.account.id),
            ensureBuffer(userBSession.account.id),
            transferAmount,
            assetId,
          ],
        },
      ],
      signers: [signatureProviderUserA.pubKey], // User A must sign the transfer
    },
    signatureProviderUserA
  );

  console.log('Transfer result:');
  console.log('status:', transferStatus);
  console.log('statusCode:', transferStatusCode);
  console.log('transactionRid:', transferTransactionRid);

  // Check final balances
  console.log(chalk.green('Final balances:'));
  console.log('User A:', await userASession.account.getBalances());
  console.log('User B:', await userBSession.account.getBalances());

  // Get transaction history
  await getTransactionHistory(userASession);
}

async function testInitialize(client: IClient) {
  try {
    const { status, statusCode, transactionRid } = await client.signAndSendUniqueTransaction(
      {
        operations: [
          {
            name: 'initialize_underlying_asset_factory',
            args: [],
          },
        ],
        signers: [signatureProviderAdmin.pubKey],
      },
      signatureProviderAdmin
    );
    // this ensure successful
    console.log('Result of admin:');
    console.log('status', status);
    console.log('statusCode', statusCode);
    console.log('transactionRid', transactionRid);

    // const {
    //   status: status2,
    //   statusCode: statusCode2,
    //   transactionRid: transactionRid2,
    // } = await client.signAndSendUniqueTransaction(
    //   {
    //     operations: [
    //       {
    //         name: 'initialize_underlying_asset_factory',
    //         args: [],
    //       },
    //     ],
    //     signers: [signatureProviderUserA.pubKey],
    //   },
    //   signatureProviderUserA
    // );
    // // this ensure fail
    // console.log('Result of user A:');
    // console.log('status2', status2);
    // console.log('statusCode2', statusCode2);
    // console.log('transactionRid2', transactionRid2);
  } catch (error) {
    console.log(error);
  }
}

async function main() {
  try {
    // Setup test environment
    const { adminSession, userASession, userBSession, client } = await setupTestEnvironment();

    console.log(chalk.green('Admin id', adminSession.account.id.toString('hex')));
    console.log(chalk.green('user a id', userASession.account.id.toString('hex')));
    console.log(chalk.green('user b id', userBSession.account.id.toString('hex')));

    // Run tests
    await testInitialize(client);
    await testCreateAndQueryAsset(adminSession, client);
    await testMintBurnBalance(adminSession, userASession, client);
    await testTransferAsset(adminSession, userASession, userBSession, client);

    console.log(chalk.green('\nAll tests completed successfully!'));
  } catch (error) {
    console.error(chalk.red('Error running tests:'), error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(chalk.red('Fatal error:'), error);
    process.exit(1);
  });
