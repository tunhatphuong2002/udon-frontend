import { createInMemoryFtKeyStore, createKeyStoreInteractor } from '@chromia/ft4';
import { IClient, KeyPair } from 'postchain-client';

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
  // if the account is not registered, register it

  const store = createInMemoryFtKeyStore(kp);

  const { getSession, getAccounts } = createKeyStoreInteractor(client, store);
  const accounts = await getAccounts();
  console.log('accounts', accounts);
  const myAccount = accounts[0];
  console.log('myAccount', myAccount);
  return await getSession(myAccount.id);
}
