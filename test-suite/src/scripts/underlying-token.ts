import { getClient } from '../clients';
import { getSession } from '../helpers';
import { admin_kp } from '../configs/key-pair';
import { registerAccountOpen } from '../common/operations/accounts';
import chalk from 'chalk';
import { Session } from '@chromia/ft4';
import { IClient } from 'postchain-client';
import { op } from '@chromia/ft4';

interface TestEnvironment {
  adminSession: Session;
  client: IClient;
}

async function initializeACL(session: Session) {
  const result = await session.call(op('initialize', admin_kp.pubKey));
  console.log('ACL initialized:', result);
  return result;
}

async function grantPoolAdminRole(session: Session, account: Buffer) {
  const result = await session.call(op('grant_role', 'POOL_ADMIN_ROLE', account, admin_kp.pubKey));
  console.log('Granted POOL_ADMIN_ROLE:', result);
  return result;
}

// async function createUnderlyingAsset(
//   session: Session,
//   assetName: string,
//   assetSymbol: string,
//   decimals: number,
//   iconUrl: string
// ) {
//   const result = await session.call(
//     op('create_underlying_asset', assetName, assetSymbol, decimals, iconUrl)
//   );
//   console.log('Asset created:', result);
//   return result;
// }

// async function mintUnderlyingAsset(
//   session: Session,
//   account: Buffer,
//   amount: number,
//   assetId: string
// ) {
//   const result = await session.call(op('mint_underlying_asset', account, amount, assetId));
//   console.log('Minted asset:', result);
//   return result;
// }

// async function burnUnderlyingAsset(
//   session: Session,
//   account: Buffer,
//   amount: number,
//   assetId: string
// ) {
//   const result = await session.call(op('burn_underlying_asset', account, amount, assetId));
//   console.log('Burned asset:', result);
//   return result;
// }

// async function getAssetsBySymbol(session: Session, symbol: string) {
//   const result = await session.query('get_assets_by_symbol', { symbol });
//   console.log('Assets by symbol:', result);
//   return result;
// }

// async function getBalances(session: Session) {
//   const result = await session.query('get_balances', { account_id: session.account.id });
//   console.log('Balances:', result);
//   return result;
// }

async function setupTestEnvironment(): Promise<TestEnvironment> {
  console.log(chalk.blue('Setting up test environment...'));

  const client = await getClient();

  // Register admin account
  await registerAccountOpen(client, admin_kp);
  const adminSession = await getSession(client, admin_kp);
  console.log(chalk.green('Admin account registered:', adminSession.account.id.toString('hex')));

  // Initialize ACL module with pool_admin
  await initializeACL(adminSession);

  // Grant POOL_ADMIN_ROLE to pool_admin account
  await grantPoolAdminRole(adminSession, adminSession.account.id);

  return { adminSession, client };
}

// async function testCreateAndQueryAsset(adminSession: Session, client: IClient) {
//   console.log(chalk.blue('\nTesting asset creation and querying...'));

//   const assetName = 'Test Token';
//   const assetSymbol = 'TT';
//   const decimals = 6;
//   const iconUrl = 'http://example.com/icon.png';

//   // Register asset
//   const { status, statusCode, transactionRid } = await client.signAndSendUniqueTransaction(
//     {
//       operations: [
//         {
//           name: 'create_underlying_asset',
//           args: [assetName, assetSymbol, decimals, iconUrl],
//         },
//       ],
//       signers: [signatureProviderAdmin.pubKey],
//     },
//     signatureProviderAdmin
//   );

//   console.log('status', status);
//   console.log('statusCode', statusCode);
//   console.log('transactionRid', transactionRid);

//   // Query asset
//   const assets = await adminSession.getAssetsBySymbol(assetSymbol);
//   console.log(chalk.green('Asset created:', assets.data[0]));
// }

// async function testMintBurnBalance(adminSession: Session, userASession: Session, client: IClient) {
//   console.log(chalk.blue('\nTesting mint, burn, and balance operations...'));

//   const assetName = 'MintCoin';
//   const assetSymbol = 'MC';
//   const decimals = 8;
//   const iconUrl = 'http://example.com/icon.png';

//   // Register asset
//   const { status, statusCode, transactionRid } = await client.signAndSendUniqueTransaction(
//     {
//       operations: [
//         {
//           name: 'create_underlying_asset',
//           args: [assetName, assetSymbol, decimals, iconUrl],
//         },
//       ],
//       signers: [signatureProviderAdmin.pubKey],
//     },
//     signatureProviderAdmin
//   );

//   console.log('status', status);
//   console.log('statusCode', statusCode);
//   console.log('transactionRid', transactionRid);

//   // Get initial balance
//   const initialBalances = await userASession.account.getBalances();
//   console.log(chalk.yellow('Initial balances:', initialBalances));

//   // Mint assets to User A
//   const mintAmount = 100_000_000_00; // 100 MC with 8 decimals
//   // await mintAssetOp(adminSession, userASession.account.id.toString('hex'), assetSymbol, mintAmount);

//   const assets = await userASession.getAssetsBySymbol(assetSymbol);

//   const assetId = assets.data[0].id;

//   console.log(assetId, 'assetId');

//   const {
//     status: status2,
//     statusCode: statusCode2,
//     transactionRid: transactionRid2,
//   } = await client.signAndSendUniqueTransaction(
//     {
//       operations: [
//         {
//           name: 'mint_underlying_asset',
//           args: [ensureBuffer(userASession.account.id), mintAmount, assetId],
//         },
//       ],
//       signers: [signatureProviderAdmin.pubKey],
//     },
//     signatureProviderAdmin
//   );
//   console.log('Result mint amount of user A:');
//   console.log('status2', status2);
//   console.log('statusCode2', statusCode2);
//   console.log('transactionRid', transactionRid2);

//   // Check balance after mint
//   const balancesAfterMint = await userASession.account.getBalances();
//   console.log(chalk.green('Balances after mint:', balancesAfterMint));

//   // Burn some assets
//   // await burnAssetOp(userASession, assetSymbol, decimals);
//   const {
//     status: status3,
//     statusCode: statusCode3,
//     transactionRid: transactionRid3,
//   } = await client.signAndSendUniqueTransaction(
//     {
//       operations: [
//         {
//           name: 'burn_underlying_asset',
//           args: [ensureBuffer(userASession.account.id), mintAmount, assetId],
//         },
//       ],
//       signers: [signatureProviderAdmin.pubKey],
//     },
//     signatureProviderAdmin
//   );
//   console.log('Result mint amount of user A:');
//   console.log('status3', status3);
//   console.log('statusCode3', statusCode3);
//   console.log('transactionRid3', transactionRid3);

//   // Check final balance
//   const finalBalances = await userASession.account.getBalances();
//   console.log(chalk.green('Final balances:', finalBalances));
// }

// async function testTransferAsset(
//   adminSession: Session,
//   userASession: Session,
//   userBSession: Session,
//   client: IClient
// ) {
//   console.log(chalk.blue('\nTesting asset transfer...'));

//   const assetName = 'TransferCoin';
//   const assetSymbol = 'TRC';
//   const decimals = 6;
//   const iconUrl = 'http://example.com/icon.png';

//   // Register asset
//   const { status, statusCode, transactionRid } = await client.signAndSendUniqueTransaction(
//     {
//       operations: [
//         {
//           name: 'create_underlying_asset',
//           args: [assetName, assetSymbol, decimals, iconUrl],
//         },
//       ],
//       signers: [signatureProviderAdmin.pubKey],
//     },
//     signatureProviderAdmin
//   );

//   console.log('Create asset result:');
//   console.log('status:', status);
//   console.log('statusCode:', statusCode);
//   console.log('transactionRid:', transactionRid);

//   // Mint to User A
//   const initialAmount = 500_000_000; // 500 TRC
//   const assets = await userASession.getAssetsBySymbol(assetSymbol);
//   const assetId = assets.data[0].id;

//   console.log('Asset ID:', assetId);

//   const {
//     status: mintStatus,
//     statusCode: mintStatusCode,
//     transactionRid: mintTransactionRid,
//   } = await client.signAndSendUniqueTransaction(
//     {
//       operations: [
//         {
//           name: 'mint_underlying_asset',
//           args: [ensureBuffer(userASession.account.id), initialAmount, assetId],
//         },
//       ],
//       signers: [signatureProviderAdmin.pubKey],
//     },
//     signatureProviderAdmin
//   );

//   console.log('Mint result:');
//   console.log('status:', mintStatus);
//   console.log('statusCode:', mintStatusCode);
//   console.log('transactionRid:', mintTransactionRid);

//   // Check initial balances
//   console.log(chalk.yellow('Initial balances:'));
//   console.log('User A:', await userASession.account.getBalances());
//   console.log('User B:', await userBSession.account.getBalances());

//   // Transfer from A to B
//   const transferAmount = 200_000_000; // 200 TRC
//   const {
//     status: transferStatus,
//     statusCode: transferStatusCode,
//     transactionRid: transferTransactionRid,
//   } = await client.signAndSendUniqueTransaction(
//     {
//       operations: [
//         {
//           name: 'transfer_underlying_asset',
//           args: [
//             ensureBuffer(userASession.account.id),
//             ensureBuffer(userBSession.account.id),
//             transferAmount,
//             assetId,
//           ],
//         },
//       ],
//       signers: [signatureProviderUserA.pubKey], // User A must sign the transfer
//     },
//     signatureProviderUserA
//   );

//   console.log('Transfer result:');
//   console.log('status:', transferStatus);
//   console.log('statusCode:', transferStatusCode);
//   console.log('transactionRid:', transferTransactionRid);

//   // Check final balances
//   console.log(chalk.green('Final balances:'));
//   console.log('User A:', await userASession.account.getBalances());
//   console.log('User B:', await userBSession.account.getBalances());

//   // Get transaction history
//   await getTransactionHistory(userASession);
// }

async function testInitialize(session: Session) {
  try {
    const result = await session.call(op('initialize_underlying_asset_factory'));
    console.log('initialize_underlying_asset_factory result:', result);
  } catch (error) {
    console.log(error);
  }
}

async function main() {
  try {
    // Setup test environment
    const { adminSession } = await setupTestEnvironment();

    console.log(chalk.green('Admin id', adminSession.account.id.toString('hex')));
    // console.log(chalk.green('user a id', userASession.account.id.toString('hex')));
    // console.log(chalk.green('user b id', userBSession.account.id.toString('hex')));

    // Run tests
    await testInitialize(adminSession);
    // await testCreateAndQueryAsset(adminSession, client);
    // await testMintBurnBalance(adminSession, userASession, client);
    // await testTransferAsset(adminSession, userASession, userBSession, client);

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
