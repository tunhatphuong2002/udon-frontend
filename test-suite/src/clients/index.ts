import { createClient } from 'postchain-client';

export async function getClient() {
  const client = await createClient({
    nodeUrlPool: 'http://localhost:7740',
    blockchainRid: '7C4398E2A96671182E78E58CDD2FDEF89364CF42928CD058A33F71C8ECD49A80',
  });

  return client;
}
