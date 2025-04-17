'use client';

import { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider } from 'connectkit';
import { WagmiProvider } from 'wagmi';
import { ThemeProvider } from 'next-themes';
import { FtProvider } from './ft-provider';
import { wagmiConfig } from '@/configs/wagmi';
// import ClientStyles from './styles-provider';

const queryClient = new QueryClient();

export function Providers(props: PropsWithChildren) {
  return (
    // <ClientStyles>
    <ThemeProvider attribute="class" defaultTheme="dark">
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <ConnectKitProvider>
            <FtProvider>{props.children}</FtProvider>
          </ConnectKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
    // </ClientStyles>
  );
}
