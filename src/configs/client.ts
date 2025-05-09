import { env } from '@/utils/env';
import type { ClientConfig } from '@chromia/react';
import { FailoverStrategy } from 'postchain-client';

const defaultClientConfig: ClientConfig = {
  nodeUrlPool: env.nodeUrlPool,
  failOverConfig: {
    attemptsPerEndpoint: 1,
    strategy: FailoverStrategy.SingleEndpoint,
  },
  // @ts-expect-error - TODO: fix this
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
