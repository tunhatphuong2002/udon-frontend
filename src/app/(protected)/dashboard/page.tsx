'use client';

import { Typography } from '@/components/common/typography';
import Image from 'next/image';
import { MultiStatCard, CombinedStatsCard } from './components/stat-card';
import { SupplyTable } from './components/supply';
import { BorrowTable } from './components/borrow';
import { PositionTabs } from './components/position-tabs';
import { useCompletedAssets } from '@/hooks/contracts/queries/use-completed-assets';
import { useStatsSupplyDeposit } from '@/hooks/contracts/queries/use-stats-supply-deposit';
import { useAccountData } from '@/hooks/contracts/queries/use-account-data';
import { useMediaQuery } from '@/hooks/use-media-query';
import { MobilePositionTabs } from './components/mobile/mobile-position-tabs';
import { MobileAssetTabs } from './components/mobile/mobile-asset-tabs';
import { DepositBadge } from './components/faucet-badge';
import { WithdrawBadge } from './components/withdraw-badge';
import { Button } from '@/components/common/button';
import { RefreshCcw, ExternalLink } from 'lucide-react';
import { env } from '@/utils/env';

// Maintenance configuration
const MAINTENANCE_CONFIG = {
  title: 'System Update in Progress',
  description:
    'Udon Protocol is undergoing scheduled maintenance to enhance performance and security',
  iconColor: 'text-primary',
  iconSize: 'h-8 w-8',
  buttons: [
    {
      label: 'Refresh',
      variant: 'gradient' as const,
      action: () => window.location.reload(),
      icon: RefreshCcw,
    },
    {
      label: 'Join X',
      variant: 'outline' as const,
      action: () => window.open('https://x.com/udonfi_chromia', '_blank'),
      icon: ExternalLink,
    },
  ],
} as const;

export default function DashboardPage() {
  // Maintenance control
  const isMaintenance = env.isMaintenance; // Set to true to show maintenance card
  console.log('isMaintenance', isMaintenance);
  // Use the enhanced custom hook to get all data
  const {
    assets: processedAssets,
    supplyPositions,
    borrowPositions,
    isLoading: isLoadingAssets,
    refresh: refetchAssets,
    yourSupplyBalancePosition,
    yourSupplyCollateralPosition,
    yourSupplyAPYPosition,
    yourBorrowBalancePosition,
    yourBorrowPowerUsagePosition,
    yourBorrowAPYPosition,
    enableBorrow,
    yourNetAPYPosition,
    yourNetWorthPosition,
  } = useCompletedAssets();

  const {
    totalValueDeposited,
    totalValueBorrowed,
    isLoading: isStatSupplyDepositFetching,
    refetch: refetchStatsSupplyDeposit,
  } = useStatsSupplyDeposit();

  const {
    data: accountData,
    isLoading: isAccountDataFetching,
    refetch: refetchAccountData,
  } = useAccountData();

  // Check if the current device is mobile
  const isMobile = useMediaQuery('(max-width: 768px)');

  const isLoadingTable = isLoadingAssets || isAccountDataFetching || isStatSupplyDepositFetching;

  const handleFetchData = () => {
    console.log('handleFetchData');
    refetchAssets();
    refetchAccountData();
    refetchStatsSupplyDeposit();
  };

  return (
    <main className="px-4 sm:px-8 py-[100px] sm:py-[180px]">
      {/* Maintenance Card - Only show when isMaintenance is true */}
      {isMaintenance ? (
        <section className="mb-8 sm:mb-10 flex justify-center my-10">
          <div className="bg-card border border-border rounded-2xl p-8 sm:p-10 max-w-2xl w-full">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="flex flex-col items-center gap-3">
                <div className="flex-shrink-0">
                  <Image
                    src="/logo/logo-shorttext.png"
                    alt="Logo"
                    width={152}
                    height={36}
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Typography variant="h3" weight="semibold" className="text-embossed text-center">
                    {MAINTENANCE_CONFIG.title}
                  </Typography>
                  <Typography
                    variant="small"
                    color="submerged"
                    className="text-sm max-w-md text-center"
                  >
                    {MAINTENANCE_CONFIG.description}
                  </Typography>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                {MAINTENANCE_CONFIG.buttons.map((button, index) => {
                  const IconComponent = button.icon;
                  return (
                    <Button
                      key={index}
                      variant={button.variant}
                      size="default"
                      onClick={button.action}
                      className="text-sm"
                    >
                      <IconComponent className="w-4 h-4" />
                      {button.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div>
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
              Streamline your
            </Typography>
            <Typography
              variant="h2"
              weight="normal"
              align="center"
              className="text-4xl sm:text-4xl md:text-[40px] font-light"
            >
              crypto investment on Chromia
            </Typography>

            <div className="flex items-center md:hidden w-max gap-4 mt-4">
              <DepositBadge />
              <WithdrawBadge />
            </div>
          </section>

          <section className="flex flex-col md:flex-row justify-between gap-6 mt-8 sm:mt-10">
            <MultiStatCard
              items={[
                {
                  value: yourNetWorthPosition || 0,
                  label: 'Net worth',
                  isLoading: isLoadingTable,
                  prefix: '$',
                  decimals: 2,
                  tooltip:
                    'The total value of your supplied assets minus your borrowed assets. Formula: Net Worth = Total Supplied - Total Borrowed. This represents your overall position in the protocol.',
                },
                {
                  value: yourNetAPYPosition || 0,
                  label: 'Net APY',
                  isLoading: isLoadingTable,
                  suffix: '%',
                  decimals: 2,
                  tooltip:
                    'Your overall earning rate considering all supplied and borrowed assets. Formula: Net APY = (Earned APY × Supply Balance/Net Worth) - (Debt APY × Borrow Balance/Net Worth). A positive value means your positions are generating net profit.',
                },
                {
                  value:
                    accountData?.healthFactorFormatted === -1
                      ? -1
                      : accountData?.healthFactorFormatted || 0,
                  label: 'Health factor',
                  isLoading: isLoadingTable,
                  decimals: 2,
                  className:
                    accountData?.healthFactorFormatted === -1
                      ? 'text-green-500'
                      : accountData?.healthFactorFormatted <= 1.25
                        ? 'text-red-500'
                        : accountData?.healthFactorFormatted <= 1.5
                          ? 'text-amber-500'
                          : 'text-green-500',
                  tooltip:
                    'Indicates the safety of your borrowed position. Values below 1 may result in liquidation. Higher values indicate a safer position.',
                },
              ]}
            />

            <CombinedStatsCard
              borrowValue={totalValueBorrowed}
              depositValue={totalValueDeposited}
              isLoading={isLoadingTable}
              depositTooltip="The total value of all assets deposited into the protocol by all users. Higher deposit values indicate more liquidity available in the market."
              borrowTooltip="The total value of all assets borrowed from the protocol by all users. This represents the total debt across the protocol."
            />
          </section>

          {isMobile ? (
            <section className="flex flex-col gap-6 mt-6">
              <MobilePositionTabs
                supplyPositions={supplyPositions}
                borrowPositions={borrowPositions}
                isLoading={isLoadingTable}
                mutateAssets={refetchAssets}
                yourSupplyBalancePosition={yourSupplyBalancePosition}
                yourSupplyCollateralPosition={yourSupplyCollateralPosition}
                yourSupplyAPYPosition={yourSupplyAPYPosition}
                yourBorrowBalancePosition={yourBorrowBalancePosition}
                yourBorrowPowerUsagePosition={yourBorrowPowerUsagePosition}
                yourBorrowAPYPosition={yourBorrowAPYPosition}
                enableBorrow={enableBorrow}
                accountData={accountData}
              />

              <MobileAssetTabs
                processedAssets={processedAssets}
                isLoading={isLoadingTable}
                mutateAssets={refetchAssets}
                enableBorrow={enableBorrow}
                accountData={accountData}
              />
            </section>
          ) : (
            <section className="grid xl:grid-cols-2 gap-4 sm:gap-5 mt-6 sm:mt-10 p-4 border border-solid rounded-3xl border-border">
              <div className="xl:col-span-2">
                <PositionTabs
                  supplyPositions={supplyPositions}
                  borrowPositions={borrowPositions}
                  yourSupplyBalancePosition={yourSupplyBalancePosition}
                  yourSupplyCollateralPosition={yourSupplyCollateralPosition}
                  yourSupplyAPYPosition={yourSupplyAPYPosition}
                  yourBorrowBalancePosition={yourBorrowBalancePosition}
                  yourBorrowPowerUsagePosition={yourBorrowPowerUsagePosition}
                  yourBorrowAPYPosition={yourBorrowAPYPosition}
                  enableBorrow={enableBorrow}
                  accountData={accountData}
                  isLoading={isLoadingTable}
                  mutateAssets={handleFetchData}
                />
              </div>
              <div className="xl:col-span-1">
                <SupplyTable
                  title="Assets to supply"
                  reserves={processedAssets}
                  isLoading={isLoadingTable}
                  mutateAssets={handleFetchData}
                  accountData={accountData}
                />
              </div>
              <div className="xl:col-span-1">
                <BorrowTable
                  title="Assets to borrow"
                  reserves={processedAssets}
                  isLoading={isLoadingTable}
                  mutateAssets={handleFetchData}
                  enableBorrow={enableBorrow}
                  accountData={accountData}
                />
              </div>
            </section>
          )}
        </div>
      )}
    </main>
  );
}
