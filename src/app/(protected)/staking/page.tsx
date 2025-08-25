'use client';

import React, { useEffect, useState } from 'react';
import { Typography } from '@/components/common/typography';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/common/tab/anim-slider';
import { StakeSection } from './components/stake-section';
import { WithdrawSection } from './components/withdraw-section';
import { ClaimSection } from './components/claim-section';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/common/button';
import { ChevronLeft } from 'lucide-react';

export default function StakingPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('stake');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['stake', 'withdraw', 'claim'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Dynamic title based on active tab
  const getTitleContent = () => {
    switch (activeTab) {
      case 'stake':
        return {
          line1: 'Stake your CHR tokens',
          line2: 'and earn rewards on Chromia',
        };
      case 'withdraw':
        return {
          line1: 'Withdraw your staked CHR',
          line2: 'with flexible options',
        };
      case 'claim':
        return {
          line1: 'Claim your withdrawals',
          line2: 'and track pending requests',
        };
      default:
        return {
          line1: 'Stake your CHR tokens',
          line2: 'and earn rewards on Chromia',
        };
    }
  };

  const titleContent = getTitleContent();

  return (
    <main className="px-4 sm:px-24 py-[100px] sm:py-[180px]">
      <div>
        <Link href="/dashboard">
          <Button
            variant="secondary"
            className="w-10 h-10 p-0 rounded-full flex items-center justify-center"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </Button>
        </Link>
        {/* Header Section */}
        <section className="flex flex-col items-center gap-2 sm:gap-2.5 mb-10 sm:mb-0">
          <div
            dangerouslySetInnerHTML={{
              __html: `<svg id="384:1283" width="152" height="36" viewBox="0 0 152 36" fill="none" xmlns="http://www.w3.org/2000/svg" class="title-icon w-40 h-10" style="max-width: 152px"> <circle cx="18" cy="18" r="17.5" stroke="currentColor"></circle> <circle cx="47" cy="18" r="17.5" stroke="currentColor"></circle> <circle cx="76" cy="18" r="17.5" stroke="currentColor"></circle> <circle cx="105" cy="18" r="17.5" stroke="currentColor"></circle> <circle cx="134" cy="18" r="17.5" stroke="currentColor"></circle> </svg>`,
            }}
            className="mb-2 text-foreground"
          />
          <Typography
            variant="h2"
            weight="normal"
            align="center"
            className="text-4xl sm:text-4xl md:text-[40px] font-light"
          >
            {titleContent.line1}
          </Typography>
          <Typography
            variant="h2"
            weight="normal"
            align="center"
            className="text-4xl sm:text-4xl md:text-[40px] font-light"
          >
            {titleContent.line2}
          </Typography>
        </section>

        {/* Main Content */}
        <section className="mt-8 sm:mt-10">
          <div className="max-w-2xl mx-auto">
            <div className="p-4 sm:p-6 border border-solid rounded-3xl border-border bg-[#161616dc]">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8 bg-card p-1 h-12">
                  <TabsTrigger value="stake" className="text-base font-medium">
                    Stake
                  </TabsTrigger>
                  <TabsTrigger value="unstake" className="text-base font-medium">
                    Unstake
                  </TabsTrigger>
                  <TabsTrigger value="claim" className="text-base font-medium">
                    Claim
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="stake" className="mt-0">
                  <StakeSection />
                </TabsContent>

                <TabsContent value="unstake" className="mt-0">
                  <WithdrawSection />
                </TabsContent>

                <TabsContent value="claim" className="mt-0">
                  <ClaimSection />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
