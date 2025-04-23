import React from 'react';
import { Typography } from '@/components/common/typography';
import Link from 'next/link';
import Image from 'next/image';
import { ConnectWallet } from '@/components/custom/wallet';
import { useRouter } from 'next/navigation';

export const Header: React.FC = () => {
  const router = useRouter();

  const sections = [
    { id: 'supply', label: 'Supply', url: '/supply' },
    { id: 'borrow', label: 'Borrow', url: '/borrow' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[20] flex flex-row px-16 justify-between items-center py-4">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 md:px-6 py-2 md:py-3 bg-background rounded-full flex items-center gap-4 md:gap-9">
        {sections.map(({ id, label, url }) => (
          <Link href={url} key={id} className="focus:outline-none">
            <Typography
              size="sm"
              className="text-white md:text-base md:font-medium cursor-pointer hover:text-primary transition-colors"
            >
              {label}
            </Typography>
          </Link>
        ))}
      </div>
      <div className="w-[210px] h-[30px] relative cursor-pointer" onClick={() => router.push('/')}>
        <Image src="/logo/logo-fulltext.png" alt="Logo" fill />
      </div>
      <div className="z-[100]">
        <ConnectWallet />
      </div>
    </header>
  );
};
