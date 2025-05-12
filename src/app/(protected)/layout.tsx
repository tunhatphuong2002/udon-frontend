'use client';

import React from 'react';
import { useEffect } from 'react';
import { ConnectKitButton } from 'connectkit';
import { useAccount } from 'wagmi';
import { useTheme } from '@/contexts/theme-context';

import { CardLoading } from '@/components/custom/card-loading';
import { useChromiaAccount } from '@/hooks/configs/chromia-hooks';
import { useAccountCreatedModal } from '@/components/custom/modals/account-created-modal';
import { MainLayout } from '@/components/layout';
import { Popup } from '@/components/common/popup';

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
            <>
              <Popup
                variant="notfound"
                title="Account not found"
                description="You need to create an chromia account first"
                buttonText={tried ? 'Retry creating account' : 'Create account'}
                onButtonClick={createAccount}
              />
            </>
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
                <>
                  <Popup
                    variant="wallet"
                    title="Connect to your wallet"
                    description="You need to connect your wallet to mint own token."
                    buttonText="Connect wallet"
                    onButtonClick={show ?? (() => {})}
                  />
                </>
              );
            }}
          </ConnectKitButton.Custom>
        )}
      </div>
    </MainLayout>
  );
};

export default Layout;
