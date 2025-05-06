import { createInMemoryFtKeyStore, createKeyStoreInteractor } from '@chromia/ft4';
import { IClient, KeyPair } from 'postchain-client';

export async function getSession(client: IClient, kp: KeyPair) {
  const store = createInMemoryFtKeyStore(kp);

  const { getSession, getAccounts } = createKeyStoreInteractor(client, store);
  const accounts = await getAccounts();
  const myAccount = accounts[0];
  return await getSession(myAccount.id);
}
