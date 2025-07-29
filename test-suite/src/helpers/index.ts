import { registerAccountOpen, registerAccountOpenEVM } from '../common/operations/accounts';
import {
  Account,
  createAmount,
  createClientToBlockchain,
  createInMemoryEvmKeyStore,
  createInMemoryFtKeyStore,
  createKeyStoreInteractor,
  getAssetDetailsForCrosschainRegistration,
  PaginatedEntity,
  registerCrosschainAsset,
  Session,
  TransactionCompletion,
} from '@chromia/ft4';
import chalk from 'chalk';
import { BufferId, IClient, KeyPair, SignatureProvider } from 'postchain-client';

export async function getSession(client: IClient, kp: KeyPair) {
  const store = createInMemoryFtKeyStore(kp);

  const { getSession, getAccounts } = createKeyStoreInteractor(client, store);
  const accounts = await getAccounts();
  console.log('accounts', accounts);
  const myAccount = accounts[0];
  console.log('myAccount', myAccount);
  return await getSession(myAccount.id);
}

export async function getSessionOrRegister(client: IClient, kp: KeyPair) {
  const resultGetAccountBySigner = (await client.query('ft4.get_accounts_by_signer', {
    id: kp.pubKey,
    page_size: null,
    page_cursor: null,
  })) as unknown as PaginatedEntity<Account>;

  console.log('resultGetAccountBySigner', resultGetAccountBySigner);

  // if the account is not registered, register it
  if (resultGetAccountBySigner?.data.length === 0) {
    console.log('registering account');
    return await registerAccountOpen(client, kp);
  } else {
    const store = createInMemoryFtKeyStore(kp);
    const { getSession } = createKeyStoreInteractor(client, store);
    console.log('getting session');
    return await getSession(resultGetAccountBySigner?.data[0]?.id);
  }
}

export async function getSessionOrRegisterEVM(client: IClient, kp: KeyPair) {
  const resultGetAccountBySigner = (await client.query('ft4.get_accounts_by_signer', {
    id: kp.pubKey,
    page_size: null,
    page_cursor: null,
  })) as unknown as PaginatedEntity<Account>;

  console.log('resultGetAccountBySigner', resultGetAccountBySigner);

  // if the account is not registered, register it
  if (resultGetAccountBySigner?.data.length === 0) {
    console.log('registering account');
    return await registerAccountOpenEVM(client, kp);
  } else {
    const store = createInMemoryEvmKeyStore(kp);
    const { getSession } = createKeyStoreInteractor(client, store);
    console.log('getting session');
    return await getSession(resultGetAccountBySigner?.data[0]?.id);
  }
}

/**
 * Registers a cross-chain asset with validation
 * @param assetId The asset ID to register
 * @param originBlockchainRid The blockchain RID where the asset originates
 * @param client The destination blockchain client
 * @param signatureProvider The signature provider for the admin account
 * @returns Promise resolving to transaction completion
 */
export async function registerAssetWithValidation(
  assetId: BufferId,
  originBlockchainRid: BufferId,
  client: IClient,
  signatureProvider: SignatureProvider
): Promise<TransactionCompletion> {
  console.log(
    chalk.blue(
      `🔄 Registering asset ${assetId.toString('hex')} from chain ${originBlockchainRid.toString('hex')}...`
    )
  );

  // Create a client for the origin blockchain
  const originBlockchainClient = await createClientToBlockchain(client, originBlockchainRid);

  // Fetch asset details from the origin blockchain
  const asset = await getAssetDetailsForCrosschainRegistration(originBlockchainClient, assetId);
  console.log('Asset details:', asset);

  // Ensure the issuing blockchain matches the origin chain
  if (
    asset.blockchainRid.toString('hex').toLowerCase() !==
    originBlockchainRid.toString('hex').toLowerCase()
  ) {
    throw new Error(
      `Validation error: Issuing blockchain (${asset.blockchainRid.toString(
        'hex'
      )}) does not match the origin (${originBlockchainRid.toString('hex')}).`
    );
  }

  // Register the validated asset on the destination chain
  const result = await registerCrosschainAsset(
    client,
    signatureProvider,
    assetId,
    originBlockchainRid
  );

  console.log(chalk.green(`✅ Asset registered successfully`));
  return result;
}

/**
 * Performs a cross-chain transfer
 * @param sourceSession The source session
 * @param targetSession The target session
 * @param assetId The asset ID to transfer
 * @param amount The amount to transfer
 * @param decimals The number of decimals for the amount
 * @returns Promise resolving when transfer is complete
 */
export async function performCrosschainTransfer(
  sourceSession: Session,
  targetSession: Session,
  assetId: string,
  amount: number,
  decimals: number
): Promise<void> {
  console.log(chalk.blue(`🔄 Preparing cross-chain transfer...`));

  const transfer = sourceSession.account.crosschainTransfer(
    targetSession.blockchainRid,
    targetSession.account.id,
    assetId,
    createAmount(amount, decimals)
  );

  transfer.on('init', () => {
    console.log(chalk.blue(`\t🔄 Transfer initialized`));
  });

  transfer.on('hop', brid => {
    console.log(chalk.blue(`\t🔄 Hopped to chain: ${chalk.white(brid.toString('hex'))}`));
  });

  console.log(chalk.blue(`🚀 Starting transfer of ${amount} tokens...`));

  try {
    await transfer;
    console.log(chalk.green(`\t✅ Transfer completed successfully`));
  } catch (error) {
    console.error(chalk.red(`\t❌ Transfer failed: ${error.message}`));
    throw error;
  }
}
