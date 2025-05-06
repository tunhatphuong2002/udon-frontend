import { createClient } from 'postchain-client';
import { testEnv } from '../configs';

export async function getClient() {
  const client = await createClient({
    nodeUrlPool: testEnv.NODE_URL,
    blockchainRid: testEnv.BLOCKCHAIN_RID,
  });

  return client;
}
