import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ConnectWallet } from '@/components/custom/wallet';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/tailwind';
import { NetworkBadge } from '../custom/landing/network-badge';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/common/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/common/navigation-menu';
import {
  ExternalLinkIcon,
  MenuIcon,
  Sparkles,
  LayoutDashboard,
  Coins,
  Zap,
  ArrowDownUp,
  Gift,
} from 'lucide-react';
import { DepositDialog } from '@/app/(protected)/dashboard/components/supply/deposit-to-udon-dialog';
import { WithdrawDialog } from '@/app/(protected)/dashboard/components/borrow/withdraw-from-udon-dialog';
import { Button } from '@/components/common/button';

export const Header: React.FC = () => {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);

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

  const blurActiveElement = () => {
    if (typeof window === 'undefined') return;
    requestAnimationFrame(() => {
      const active = document.activeElement as HTMLElement | null;
      active?.blur();
    });
  };

  const handleGoToStaking = () => {
    setIsActionsOpen(false);
    blurActiveElement();
    router.push('/staking');
  };

  const handleGoToDashboard = () => {
    setIsActionsOpen(false);
    blurActiveElement();
    router.push('/dashboard');
  };

  const handleOpenDeposit = () => {
    setIsActionsOpen(false);
    blurActiveElement();
    setIsDepositOpen(true);
  };

  const handleOpenWithdraw = () => {
    setIsActionsOpen(false);
    blurActiveElement();
    setIsWithdrawOpen(true);
  };

  const handleStakingNavigation = (tab: string) => {
    router.push(`/staking?tab=${tab}`);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-[20] flex flex-row sm:px-16 px-4 justify-between items-center py-4 transition-all duration-300 bg-background/10 backdrop-blur-md shadow-sm'
        // scrolled && 'bg-background/10 backdrop-blur-md shadow-sm'
      )}
    >
      <div className="flex flex-row items-center">
        <div className="w-[94px] h-[46px] relative cursor-pointer" onClick={() => router.push('/')}>
          <Image src="/logo/logo-shorttext.png" alt="Logo" fill className="object-contain" />
          <NetworkBadge network="mainnet" />
        </div>

        {/* Navigation Menu */}
        <NavigationMenu className="hidden md:flex ml-20">
          <NavigationMenuList>
            {/* Dashboard - Regular Button */}
            <div
              className={cn(
                'text-foreground hover:text-primary hover:bg-white/10 transition-all cursor-pointer',
                'border-none rounded-full shadow-none focus:outline-none text-base',
                'inline-flex h-10 w-max items-center justify-center px-4 py-2 text-sm font-medium'
              )}
              onClick={() => router.push('/dashboard')}
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </div>

            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={cn(
                  'bg-transparent text-foreground hover:text-primary data-[state=open]:text-primary transition-all',
                  'border-none rounded-full shadow-none focus:outline-none text-base'
                )}
              >
                <Coins className="w-4 h-4 mr-2" />
                Staking
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-4 w-[400px] bg-card rounded-xl shadow-lg">
                  {/* Main Stake Card */}
                  <NavigationMenuLink asChild>
                    <div
                      className="group relative overflow-hidden rounded-lg bg-transparent border-none p-4 cursor-pointer transition-all duration-200"
                      onClick={() => handleStakingNavigation('stake')}
                    >
                      {/* Gradient Border */}
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] p-[1px] bg-gradient-to-r from-[#52E5FF] via-[#36B1FF] to-[#E4F5FF]"
                      />
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-[1px] z-10 rounded-[inherit] bg-card"
                      />

                      {/* Content */}
                      <div className="relative z-20">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-md bg-muted">
                            <Zap className="w-5 h-5 text-[#36B1FF]" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium bg-gradient-to-r from-[#52E5FF] via-[#36B1FF] to-[#E4F5FF] bg-clip-text text-transparent">
                                Stake
                              </h4>
                              <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">
                                3% APY
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Stake CHR and receive stCHR to earn rewards
                        </p>
                      </div>
                    </div>
                  </NavigationMenuLink>

                  {/* Secondary Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <NavigationMenuLink asChild>
                      <div
                        className="group relative overflow-hidden rounded-lg bg-transparent border border-border p-3 cursor-pointer transition-all duration-200 hover:border-white/30"
                        onClick={() => handleStakingNavigation('withdraw')}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <ArrowDownUp className="w-4 h-4 text-muted-foreground" />
                          <h5 className="text-sm font-medium">Withdraw</h5>
                        </div>
                        <p className="text-sm text-muted-foreground leading-tight">
                          Request stCHR withdrawal
                        </p>
                      </div>
                    </NavigationMenuLink>

                    <NavigationMenuLink asChild>
                      <div
                        className="group relative overflow-hidden rounded-lg bg-transparent border border-border p-3 cursor-pointer transition-all duration-200 hover:border-white/30"
                        onClick={() => handleStakingNavigation('claim')}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Gift className="w-4 h-4 text-muted-foreground" />
                          <h5 className="text-sm font-medium">Claim</h5>
                        </div>
                        <p className="text-muted-foreground leading-tight text-sm">
                          Claim completed withdrawals
                        </p>
                      </div>
                    </NavigationMenuLink>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="z-[100] flex items-center gap-3">
        <ConnectWallet />
        <DropdownMenu open={isActionsOpen} onOpenChange={setIsActionsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outlineGradient"
              size="icon"
              aria-label="Actions"
              className="shadow-none"
            >
              <MenuIcon color="white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Quick actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleGoToDashboard}>
              <ExternalLinkIcon className="size-4 mr-2" /> Go to Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleGoToStaking}>
              <ExternalLinkIcon className="size-4 mr-2" /> Go to Staking
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleOpenDeposit}>
              <Sparkles className="size-4 mr-2" /> Deposit to Udon
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleOpenWithdraw}>
              <Sparkles className="size-4 mr-2" /> Withdraw from Udon
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* dialogs */}
      {isDepositOpen && <DepositDialog open={isDepositOpen} onOpenChange={setIsDepositOpen} />}
      {isWithdrawOpen && <WithdrawDialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen} />}
    </header>
  );
};
