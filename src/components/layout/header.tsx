import React from 'react';
import Image from 'next/image';
import { ConnectWallet } from '@/components/custom/wallet';
import { useRouter } from 'next/navigation';

export const Header: React.FC = () => {
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 right-0 z-[20] flex flex-row px-16 justify-between items-center py-4">
      <div className="w-[210px] h-[30px] relative cursor-pointer" onClick={() => router.push('/')}>
        <Image src="/logo/logo-fulltext.png" alt="Logo" fill />
      </div>
      <div className="z-[100]">
        <ConnectWallet />
      </div>
    </header>
  );
};
