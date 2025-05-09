'use client';

import type React from 'react';
import { useEffect } from 'react';
import { ConnectKitButton } from 'connectkit';
import { useAccount } from 'wagmi';
import { useTheme } from '@/contexts/theme-context';

import { CardLoading } from '@/components/custom/card-loading';
import { Card, CardDescription, CardTitle } from '@/components/common/card';
import { useChromiaAccount } from '@/hooks/configs/chromia-hooks';
import { useAccountCreatedModal } from '@/components/custom/modals/account-created-modal';
import { MainLayout } from '@/components/layout';
import { Button } from '@/components/common/button';

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { isConnected, isReconnecting } = useAccount();
  const { show } = useAccountCreatedModal();
  const { hasAccount, createAccount, isLoading, tried } = useChromiaAccount({
    onAccountCreated: show,
  });
  const { setTheme } = useTheme();

  useEffect(() => {
    // Set dark theme for app pages
    setTheme('dark');
  }, [setTheme]);

  if (isConnected) {
    if (hasAccount) {
      return <MainLayout>{children}</MainLayout>;
    }

    return (
      <MainLayout>
        <div className="h-screen flex flex-1 items-center justify-center">
          {isLoading || isReconnecting ? (
            <CardLoading />
          ) : (
            <Card className="min-w-52 p-6 text-center">
              <CardTitle>Account not found</CardTitle>
              <CardDescription className="mt-2 max-w-2xl">
                You need to create an chromia account first to mint own token.
              </CardDescription>
              <Button onClick={createAccount} className="mx-auto mt-4 min-w-44">
                {tried ? 'Retry creating account' : 'Create account'}
              </Button>
            </Card>
          )}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="h-screen flex flex-1 items-center justify-center">
        {isLoading || isReconnecting ? (
          <CardLoading />
        ) : (
          <ConnectKitButton.Custom>
            {({ show, isConnecting }) => {
              if (isConnecting) {
                return <CardLoading />;
              }

              return (
                <Card className="min-w-52 p-6 text-center">
                  <CardTitle>Connect to your wallet</CardTitle>
                  <CardDescription className="mt-2">
                    You need to connect your wallet to mint own token.
                  </CardDescription>
                  <Button onClick={show} className="mx-auto mt-4 w-44">
                    Connect wallet
                  </Button>
                </Card>
              );
            }}
          </ConnectKitButton.Custom>
        )}
      </div>
    </MainLayout>
  );
};

export default Layout;
