'use client';

import React from 'react';
import { ConnectKitButton } from 'connectkit';
import { useAccount } from 'wagmi';

import Button from '@/components/chromia-ui-kit/button';
import { CardLoading } from '@/components/custom/card-loading';
import { useAccountCreatedModal } from '@/components/custom/modals/account-created-modal';
import { Card, CardDescription, CardTitle } from '@/components/common/card';
import { useChromiaAccount } from '@/hooks/chromia-hooks';
// import Header from "@/components/layout/header";

export function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isConnected } = useAccount();
  const { show } = useAccountCreatedModal();
  const { hasAccount, createAccount, isLoading, tried } = useChromiaAccount({
    onAccountCreated: show,
  });

  return (
    <div
      suppressHydrationWarning
      className="relative bg-contain text-black dark:text-white flex min-h-screen flex-col p-6 transition-all duration-500"
    >
      {/* Include the modal component */}
      {/* <AccountCreatedModal /> */}

      {/* <Header /> */}
      <main className="container flex flex-1 flex-col">
        <AuthContent
          isConnected={isConnected}
          hasAccount={hasAccount}
          isLoading={isLoading}
          createAccount={createAccount}
          tried={tried}
        >
          {children}
        </AuthContent>
      </main>
    </div>
  );
}

function AuthContent({
  children,
  isConnected,
  hasAccount,
  isLoading,
  createAccount,
  tried,
}: {
  children: React.ReactNode;
  isConnected: boolean;
  hasAccount: boolean;
  isLoading: boolean;
  createAccount: () => void;
  tried: boolean;
}) {
  console.log('isConnected', isConnected);
  console.log('hasAccount', hasAccount);
  console.log('isLoading', isLoading);
  console.log('tried', tried);
  if (isConnected) {
    if (hasAccount) {
      return children;
    }

    return (
      <div className="flex flex-1 items-center justify-center">
        {isLoading ? (
          <CardLoading />
        ) : (
          <Card className="min-w-52 p-6 text-center">
            <CardTitle>Account not found</CardTitle>
            <CardDescription className="mt-2">
              You need to create a Chromia account first to manage your tasks.
            </CardDescription>
            <Button onClick={createAccount} className="mx-auto mt-4 min-w-44">
              {tried ? 'Retry creating account' : 'Create account'}
            </Button>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center">
      <ConnectKitButton.Custom>
        {({ show, isConnecting }) => {
          if (isConnecting) {
            return <CardLoading />;
          }

          return (
            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-col absolute top-44 left-64 h-80 w-80 items-center mb-6">
                <CardDescription className="mt-2">
                  {/* <img src="/image.png" className="rounded-lg h-auto"></img> */}
                </CardDescription>
              </div>
              <div className="flex flex-col items-center gap-2 absolute top-44 bg-white bg-opacity-20 backdrop-blur-md p-8 rounded-md right-80 w-96">
                <p>
                  Cromia To-Do App is a blockchain-powered task manager that ensures security,
                  transparency, and efficiency. It enables seamless task creation, collaboration,
                  and real-time updates with decentralized storage. Perfect for individuals and
                  teams, it combines Web3 innovation with user-friendly design.
                </p>
              </div>
              <div>
                <Card className="min-w-52 p-6 ml-10 mt-96 text-center  ">
                  <CardTitle>Connect to your wallet</CardTitle>
                  <CardDescription className="mt-2">
                    You need to connect your wallet to manage your tasks.
                  </CardDescription>
                  <Button onClick={show} className="mx-auto mt-4 w-44">
                    Connect wallet
                  </Button>
                </Card>
              </div>
            </div>
          );
        }}
      </ConnectKitButton.Custom>
    </div>
  );
}
