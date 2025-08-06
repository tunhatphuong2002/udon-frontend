'use client';

import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/common/tab/anim-slider';
import { SupplyPositionTable } from './supply/position';
import { BorrowPositionTable } from './borrow/position';
import { LiquidatedTable } from './liquidated-table';
import { useGetLiquidated } from '@/hooks/contracts/queries/use-get-liquidated';
import { UserReserveData } from '../types';
import { UserAccountData } from '../types';
import { Typography } from '@/components/common/typography';

interface PositionTabsProps {
  supplyPositions: UserReserveData[];
  borrowPositions: UserReserveData[];
  yourSupplyBalancePosition: number;
  yourSupplyCollateralPosition: number;
  yourSupplyAPYPosition: number;
  yourBorrowBalancePosition: number;
  yourBorrowPowerUsagePosition: number;
  yourBorrowAPYPosition: number;
  enableBorrow: boolean;
  accountData?: UserAccountData;
  isLoading: boolean;
  mutateAssets: () => void;
}

export const PositionTabs: React.FC<PositionTabsProps> = ({
  supplyPositions,
  borrowPositions,
  yourSupplyBalancePosition,
  yourSupplyCollateralPosition,
  yourSupplyAPYPosition,
  yourBorrowBalancePosition,
  yourBorrowPowerUsagePosition,
  yourBorrowAPYPosition,
  enableBorrow,
  accountData,
  isLoading,
  mutateAssets,
}) => {
  const {
    data: liquidatedData,
    liquidatedCount,
    isLoading: isLiquidatedLoading,
  } = useGetLiquidated();

  return (
    <Tabs defaultValue="positions" className="w-full">
      <TabsList className="grid w-[25%] grid-cols-2">
        <TabsTrigger value="positions">My Positions</TabsTrigger>
        <TabsTrigger value="liquidated">
          Liquidated{liquidatedCount > 0 && ` (${liquidatedCount})`}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="positions" className="mt-6">
        {accountData ? (
          <div className="grid xl:grid-cols-2 gap-4 sm:gap-5">
            <SupplyPositionTable
              yourSupplyBalancePosition={yourSupplyBalancePosition}
              yourSupplyCollateralPosition={yourSupplyCollateralPosition}
              yourSupplyAPYPosition={yourSupplyAPYPosition}
              positions={supplyPositions}
              isLoading={isLoading}
              mutateAssets={mutateAssets}
              accountData={accountData}
            />
            <BorrowPositionTable
              yourBorrowBalancePosition={yourBorrowBalancePosition}
              yourBorrowPowerUsagePosition={yourBorrowPowerUsagePosition}
              yourBorrowAPYPosition={yourBorrowAPYPosition}
              positions={borrowPositions}
              isLoading={isLoading}
              mutateAssets={mutateAssets}
              enableBorrow={enableBorrow}
              accountData={accountData}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center py-12 bg-card">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-8 h-8 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <Typography variant="h4" weight="semibold" className="mb-2">
                Loading Account Data
              </Typography>
              <Typography variant="small" color="submerged">
                Please wait while we load your account information...
              </Typography>
            </div>
          </div>
        )}
      </TabsContent>

      <TabsContent value="liquidated" className="mt-6">
        <LiquidatedTable
          liquidatedData={liquidatedData?.liquidated || []}
          debtAsset={liquidatedData?.debtAsset}
          collateralAsset={liquidatedData?.collateralAsset}
          isLoading={isLiquidatedLoading}
        />
      </TabsContent>
    </Tabs>
  );
};
