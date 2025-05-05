import { createClient } from 'postchain-client';

export async function getClient() {
  const client = await createClient({
    nodeUrlPool: 'http://localhost:7740',
    blockchainRid: '4ECB1F49491F09CD1155A34C5FAB7DA79E38270038F4CADF3065ACAD2FD979FD',
  });

  return client;
}
