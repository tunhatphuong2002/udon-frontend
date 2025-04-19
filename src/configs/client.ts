import type { ClientConfig } from '@chromia/react';
import { FailoverStrategy } from 'postchain-client';

const defaultClientConfig: ClientConfig = {
  nodeUrlPool: process.env.NEXT_PUBLIC_NODE_URL,
  failOverConfig: {
    attemptsPerEndpoint: 1,
    strategy: FailoverStrategy.SingleEndpoint,
  },
  stickyNodeDiscovery: true,
};

export const generateClientConfig = (config?: ClientConfig): NonNullable<ClientConfig> => {
  return {
    ...defaultClientConfig,
    ...config,
  };
};

export const publicClientConfig = generateClientConfig({
  blockchainRid: process.env.NEXT_PUBLIC_BRID,
});
