'use client';

import { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider } from 'connectkit';
import { WagmiProvider } from 'wagmi';
import { ThemeProvider } from 'next-themes';
import { FtProvider } from './ft-provider';
import { wagmiConfig } from '@/configs/wagmi';
import ClientStyles from './styles-provider';
import NiceModal from '@ebay/nice-modal-react';

const queryClient = new QueryClient();

export function Providers(props: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <ClientStyles>
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <ConnectKitProvider>
              <FtProvider>
                <NiceModal.Provider>{props.children}</NiceModal.Provider>
              </FtProvider>
            </ConnectKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </ClientStyles>
    </ThemeProvider>
  );
}
