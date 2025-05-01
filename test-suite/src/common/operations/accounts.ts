import {
  createConnection,
  createInMemoryFtKeyStore,
  createSingleSigAuthDescriptorRegistration,
  registerAccount,
  registrationStrategy,
} from '@chromia/ft4';
import chalk from 'chalk';
import { IClient, KeyPair } from 'postchain-client';

export async function registerAccountOpen(client: IClient, kp: KeyPair) {
  const store = createInMemoryFtKeyStore(kp);
  const connection = createConnection(client);
  const { session } = await registerAccount(
    connection.client,
    store,
    registrationStrategy.open(createSingleSigAuthDescriptorRegistration(['A', 'T'], store.id, null))
  );
  chalk.green(`Account ${kp.pubKey} registered with session ${session.account.id.toString('hex')}`);
  return session;
}

export async function registerAccountTransferFee(client: IClient, kp: KeyPair, assetId: string) {
  const store = createInMemoryFtKeyStore(kp);
  const connection = createConnection(client);

  const authDescriptor = createSingleSigAuthDescriptorRegistration(['A', 'T'], store.id, null);

  const asset = await connection.getAssetById(assetId);
  if (!asset) {
    throw new Error(`Asset with ID ${assetId} not found`);
  }

  const { session } = await registerAccount(
    connection.client,
    store,
    registrationStrategy.transferFee(asset, authDescriptor, null)
  );

  chalk.green(`Account ${kp.pubKey} registered with session ${session.account.id.toString('hex')}`);
  return session;
}

export async function registerAccountTransferOpen(client: IClient, kp: KeyPair) {
  const store = createInMemoryFtKeyStore(kp);

  const authDescriptor = createSingleSigAuthDescriptorRegistration(['A', 'T'], store.id, null);

  const { session } = await registerAccount(
    client,
    store,
    registrationStrategy.transferOpen(authDescriptor, null)
  );

  chalk.green(`Account ${kp.pubKey} registered with session ${session.account.id.toString('hex')}`);
  return session;
}

export async function registerAccountTransferSubscription(
  client: IClient,
  kp: KeyPair,
  assetId: string
) {
  const store = createInMemoryFtKeyStore(kp);
  const connection = createConnection(client);

  const authDescriptor = createSingleSigAuthDescriptorRegistration(['A', 'T'], store.id, null);

  const asset = await connection.getAssetById(assetId);
  if (!asset) {
    throw new Error(`Asset with ID ${assetId} not found`);
  }

  const { session } = await registerAccount(
    client,
    store,
    registrationStrategy.transferSubscription(asset, authDescriptor, null)
  );

  chalk.green(`Account ${kp.pubKey} registered with session ${session.account.id.toString('hex')}`);
  return session;
}
