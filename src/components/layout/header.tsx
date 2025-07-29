import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ConnectWallet } from '@/components/custom/wallet';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/tailwind';
import { Button } from '../common/button';
// import { ExternalLinkIcon } from 'lucide-react';
import { Typography } from '../common/typography';
import CountUp from '../common/count-up';
import { useStats } from '@/contexts/stats-context';
// import { SparklesIcon } from 'lucide-react';
// import { ShineBorder } from '@/components/common/shine-border';
// import { Typography } from '../common/typography';
import { NetworkBadge } from '../custom/landing/network-badge';

// // Testnet badge component
// const TestnetBadge = () => {
//   return (
//     <div
//       className={cn(
//         'relative overflow-hidden inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium',
//         'absolute right-[-54px] top-[-15px]',
//         'bg-card/80'
//       )}
//     >
//       <ShineBorder shineColor={['#36B1FF', '#E4F5FF']} duration={10} />
//       <SparklesIcon className="w-3 h-3" />
//       <Typography weight="medium" className="text-[8px] uppercase text-bold">
//         Testnet
//       </Typography>
//     </div>
//   );
// };

export const Header: React.FC = () => {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const { totalDeposit, totalBorrow } = useStats();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Call once to set initial state
    handleScroll();

    // Clean up event listener
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-[20] flex flex-row sm:px-16 px-4 justify-between items-center py-4 transition-all duration-300',
        scrolled && 'bg-background/10 backdrop-blur-md shadow-sm'
      )}
    >
      <div className="w-[94px] h-[46px] relative cursor-pointer" onClick={() => router.push('/')}>
        <Image src="/logo/logo-shorttext.png" alt="Logo" fill className="object-contain" />
        <NetworkBadge network="mainnet" />
      </div>
      <div className="z-[100] flex items-center gap-3">
        {/* Total Deposit Button */}
        <Button
          variant="outlineGradient"
          className="hidden sm:flex flex-col items-center gap-1 px-3 py-[6px] h-auto"
        >
          <CountUp value={totalDeposit} prefix="$" className="text-lg font-medium " decimals={2} />
          <Typography variant="small" color="submerged" className="text-base">
            Total Deposit
          </Typography>
        </Button>

        {/* Total Borrow Button */}
        <Button
          variant="outlineGradient"
          className="hidden sm:flex flex-col items-center gap-1 px-3 py-[6px] h-auto"
        >
          <CountUp value={totalBorrow} prefix="$" className="text-lg font-medium" decimals={2} />
          <Typography variant="small" color="submerged" className="text-base">
            Total Borrow
          </Typography>
        </Button>

        {/* <Button
          variant="gradient"
          onClick={() => window.open('https://testnet.udonfi.xyz/', '_blank')}
          className="text-sm"
        >
          <ExternalLinkIcon className="w-4 h-4 mr-1" />
          Try Testnet
        </Button> */}
        <ConnectWallet />
      </div>
    </header>
  );
};
