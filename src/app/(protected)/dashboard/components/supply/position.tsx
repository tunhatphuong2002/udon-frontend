'use client';

import React, { useState } from 'react';
import { SortableTable, ColumnDef } from '@/components/common/sortable-table';
import { Button } from '@/components/common/button';
import { Switch } from '@/components/common/switch';
import { Typography } from '@/components/common/typography';
import { Badge } from '@/components/common/badge';
import { Skeleton } from '@/components/common/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/common/tooltip';
import { SupplyDialog } from './supply-dialog';
import { WithdrawDialog } from './withdraw-dialog';
import { CollateralDialog } from './collateral-dialog';
import { StakingProgressDialog } from './staking-progress-dialog';
import { UserAccountData, UserReserveData } from '../../types';
import { useRouter } from 'next/navigation';
import CountUp from '@/components/common/count-up';
import {
  useLsdPosition,
  getStakingStatusForAsset,
  StakingStatus,
  UserSupplyRecord,
} from '@/hooks/contracts/queries/use-lsd-position';
import { cn } from '@/utils/tailwind';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';

// Import mapping from staking dialog
const STAKING_STATUS_MAP: Record<string, StakingStatus> = {
  PENDING_STAKING: StakingStatus.PENDING_STAKING,
  CROSS_CHAIN_TRANSFERRING_TO_ECONOMY: StakingStatus.CROSS_CHAIN_TRANSFERRING_TO_ECONOMY,
  BRIDGING_TO_BSC: StakingStatus.BRIDGING_TO_BSC,
  TRANSFER_TO_USER: StakingStatus.TRANSFER_TO_USER,
  APPROVE_ERC20: StakingStatus.APPROVE_ERC20,
  STAKED: StakingStatus.STAKED,
};

interface SupplyPositionTableProps {
  positions: UserReserveData[];
  isLoading: boolean;
  mutateAssets: () => void;
  yourSupplyBalancePosition: number;
  yourSupplyCollateralPosition: number;
  yourSupplyAPYPosition: number;
  accountData: UserAccountData;
}

export const SupplyPositionTable: React.FC<SupplyPositionTableProps> = ({
  positions,
  isLoading,
  mutateAssets,
  yourSupplyBalancePosition,
  yourSupplyCollateralPosition,
  yourSupplyAPYPosition,
  accountData,
}) => {
  const router = useRouter();

  // LSD data fetching
  const { data: lsdData, isLoading: lsdLoading } = useLsdPosition();

  // Dialog state management
  const [selectedPosition, setSelectedPosition] = useState<UserReserveData | null>(null);
  const [supplyDialogOpen, setSupplyDialogOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  // Collateral dialog state
  const [collateralDialogOpen, setCollateralDialogOpen] = useState(false);
  const [selectedCollateral, setSelectedCollateral] = useState<UserReserveData | null>(null);
  // Staking progress dialog state
  const [stakingProgressDialogOpen, setStakingProgressDialogOpen] = useState(false);
  const [selectedStakingAsset, setSelectedStakingAsset] = useState<string>('');
  const [selectedRecordIndex, setSelectedRecordIndex] = useState<number>(0);

  // Handle supply button click for a position
  const handleSupplyClick = (position: UserReserveData) => {
    console.log('position', position);
    setSelectedPosition(position);
    setSupplyDialogOpen(true);
  };

  // Handle withdraw button click for a position
  const handleWithdrawClick = (position: UserReserveData) => {
    setSelectedPosition(position);
    setWithdrawDialogOpen(true);
  };

  // Handle collateral switch click
  const handleCollateralSwitch = (position: UserReserveData) => {
    setSelectedCollateral(position);
    setCollateralDialogOpen(true);
  };

  // Handle asset click
  const handleAssetClick = (asset: string, symbol: string) => {
    // For tCHR, open staking progress dialog instead of navigating to reserve page
    if (symbol === 'tCHR') {
      setSelectedStakingAsset(symbol);
      setSelectedRecordIndex(0); // Default to first record
      setStakingProgressDialogOpen(true);
    } else {
      router.push(`/reserve/${asset}`);
    }
  };

  // Handle staking progress pill click
  const handleStakingProgressClick = (symbol: string, recordIndex?: number) => {
    setSelectedStakingAsset(symbol);
    setSelectedRecordIndex(recordIndex ?? 0);
    setStakingProgressDialogOpen(true);
  };

  // Helper function to get short status text
  const getShortStatus = (status: string): string => {
    switch (status) {
      case 'STAKED':
        return 'Staking';
      case 'PENDING_STAKING':
        return 'Pending';
      case 'CROSS_CHAIN_TRANSFERRING_TO_ECONOMY':
        return 'Transferring';
      case 'BRIDGING_TO_BSC':
        return 'Bridging';
      case 'TRANSFER_TO_USER':
        return 'Processing';
      case 'APPROVE_ERC20':
        return 'Approving';
      default:
        return 'Unknown';
    }
  };

  // Render staking progress pills for multiple records
  const renderStakingProgressPills = (symbol: string, records: UserSupplyRecord[]) => {
    if (!records || records.length === 0) {
      return (
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-3 hover:bg-muted/30 transition-all duration-300 border border-border/30 rounded-lg min-w-[120px] bg-gradient-to-r from-muted/10 to-muted/5"
                onClick={() => handleStakingProgressClick(symbol)}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="relative">
                    <div className="w-3 h-3 bg-muted-foreground/40 rounded-full" />
                  </div>
                  <div className="flex flex-col items-start flex-1">
                    <Typography variant="small" className="text-muted-foreground/80 font-medium">
                      Not staking
                    </Typography>
                    <Typography variant="small" className="text-muted-foreground/60 text-xs">
                      Click to start
                    </Typography>
                  </div>
                  <div className="p-1 rounded-full text-muted-foreground/60">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Start staking to earn additional rewards</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    // Single record case
    if (records.length === 1) {
      const stakingInfo = getStakingStatusForAsset(symbol, lsdData);

      const getStatusDisplay = () => {
        if (stakingInfo.hasError) {
          return {
            icon: <XCircle className="w-4 h-4" />,
            text: 'Failed',
            textColor: 'text-destructive',
            bgColor: 'bg-gradient-to-r from-destructive/10 to-red-500/10',
            borderColor: 'border-destructive/30',
            dotColor: 'bg-destructive',
          };
        }

        if (stakingInfo.isStaked) {
          return {
            icon: <CheckCircle2 className="w-4 h-4" />,
            text: 'Staked',
            textColor: 'text-emerald-600 dark:text-emerald-400',
            bgColor: 'bg-gradient-to-r from-emerald-500/10 to-green-500/10',
            borderColor: 'border-emerald-500/30',
            dotColor: 'bg-gradient-to-r from-emerald-500 to-green-500',
          };
        }

        return {
          icon: <Loader2 className="w-4 h-4 animate-spin" />,
          text: 'Processing',
          textColor: 'text-primary',
          bgColor: 'bg-gradient-to-r from-primary/10 to-blue-500/10',
          borderColor: 'border-primary/30',
          dotColor: 'bg-gradient-to-r from-primary to-blue-500',
          isAnimated: true,
        };
      };

      const status = getStatusDisplay();

      return (
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'h-auto p-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-sm',
                  status.bgColor,
                  status.borderColor,
                  'border rounded-lg min-w-[120px]'
                )}
                onClick={() => handleStakingProgressClick(symbol, 0)}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="relative flex items-center justify-center">
                    <div className={cn('w-3 h-3 rounded-full', status.dotColor)} />
                    {status.isAnimated && (
                      <div
                        className={cn(
                          'absolute inset-0 w-3 h-3 rounded-full animate-ping opacity-40',
                          'bg-primary'
                        )}
                      />
                    )}
                  </div>
                  <div className="flex flex-col items-start flex-1">
                    <Typography variant="small" weight="medium" className={status.textColor}>
                      {status.text}
                    </Typography>
                    {stakingInfo.hasError && (
                      <Typography variant="small" className="text-muted-foreground text-xs">
                        Click for details
                      </Typography>
                    )}
                  </div>
                  <div className={cn('p-1 rounded-full', status.textColor)}>{status.icon}</div>
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>
                {stakingInfo.hasError
                  ? 'Click to view error details'
                  : stakingInfo.isStaked
                    ? 'View staking progress and rewards'
                    : 'View staking progress'}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    // Helper function to safely convert BigInt to number and format
    const formatSupplyAmount = (amount: number | bigint): string => {
      const numAmount = typeof amount === 'bigint' ? Number(amount) : amount;
      return (numAmount / 1e6).toFixed(2);
    };

    // Multiple records case - render single pill with segments
    return (
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <div className="relative cursor-pointer">
              {/* Single pill container */}
              <div className="flex items-center h-5 rounded-full border border-border/30 bg-muted/20 overflow-hidden min-w-auto">
                {records.map((record, index) => {
                  const recordStatus =
                    typeof record.stakingStatus === 'string'
                      ? (STAKING_STATUS_MAP[record.stakingStatus] ?? StakingStatus.PENDING_STAKING)
                      : record.stakingStatus;

                  const isStaked = recordStatus === StakingStatus.STAKED;
                  const isProcessing =
                    recordStatus !== StakingStatus.STAKED &&
                    recordStatus !== StakingStatus.PENDING_STAKING;

                  let segmentColor = 'bg-muted-foreground/30'; // pending
                  if (isStaked) segmentColor = 'bg-gradient-to-r from-emerald-500 to-green-500';
                  else if (isProcessing) segmentColor = 'bg-gradient-to-r from-primary to-blue-500';

                  return (
                    <div
                      key={index}
                      className={cn(
                        'flex-1 h-full transition-all duration-300 hover:brightness-110 relative group',
                        segmentColor,
                        'first:rounded-l-full last:rounded-r-full'
                      )}
                      onClick={e => {
                        e.stopPropagation();
                        handleStakingProgressClick(symbol, index);
                      }}
                    >
                      {/* Hover effect */}
                      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300 first:rounded-l-full last:rounded-r-full" />

                      {/* Processing animation */}
                      {isProcessing && (
                        <div className="absolute inset-0 bg-white/20 animate-pulse first:rounded-l-full last:rounded-r-full" />
                      )}

                      {/* Segment divider */}
                      {index < records.length - 1 && (
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-4 bg-black/20" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Records count label */}
              <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2">
                <Typography variant="small" className="text-muted-foreground text-xs">
                  {records.length} stakings
                </Typography>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <div className="space-y-1">
              <Typography variant="small" weight="semibold">
                Multiple Staking Records ({records.length})
              </Typography>
              {records.slice(0, 3).map((record, index) => {
                const amount = formatSupplyAmount(record.netAmount);
                const shortStatus = getShortStatus(
                  typeof record.stakingStatus === 'string' ? record.stakingStatus : 'UNKNOWN'
                );
                return (
                  <div key={index} className="flex justify-between text-xs">
                    <span>Supply #{index + 1}:</span>
                    <span>
                      {amount} CHR - {shortStatus}
                    </span>
                  </div>
                );
              })}
              {records.length > 3 && (
                <Typography variant="small" className="text-muted-foreground">
                  +{records.length - 3} more...
                </Typography>
              )}
              <Typography variant="small" className="text-primary mt-2 font-medium">
                Click any segment to view details
              </Typography>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  // Render asset icon and symbol
  const renderAssetCell = (row: UserReserveData) => {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => handleAssetClick(row.assetId.toString('hex'), row.symbol)}
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Typography variant="small" weight="bold" className="text-primary">
                  {row.symbol.charAt(0)}
                </Typography>
              </div>
              <Typography weight="medium">{row.symbol}</Typography>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>{row.name}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  // Define columns for the positions table
  const columns: ColumnDef<UserReserveData>[] = [
    {
      header: 'Assets',
      accessorKey: 'symbol',
      cell: ({ row }) => renderAssetCell(row),
      enableSorting: true,
      meta: {
        skeleton: (
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="w-24 h-5" />
          </div>
        ),
      },
    },
    {
      header: 'Amount',
      accessorKey: 'currentATokenBalance',
      enableSorting: true,
      cell: ({ row }) => {
        const balance = row.currentATokenBalance;
        const balanceUsd = Number(balance) * (row.price || 0);
        return (
          <div className="flex flex-col gap-2">
            <CountUp value={Number(balance)} className="text-base" />
            <Typography variant="small" color="submerged">
              <CountUp value={balanceUsd} prefix="$" className="text-sm text-submerged" />
            </Typography>
          </div>
        );
      },
      meta: {
        skeleton: (
          <div>
            <Skeleton className="w-24 h-5 mb-1" />
            <Skeleton className="w-16 h-4" />
          </div>
        ),
      },
    },
    {
      header: 'APY',
      accessorKey: 'supplyAPY',
      enableSorting: true,
      cell: ({ row }) => {
        const stakingInfo = getStakingStatusForAsset(row.symbol, lsdData);
        const hasStakingAPY = stakingInfo.isStaked && stakingInfo.stakingAPY > 0;
        const totalAPY = row.supplyAPY + (hasStakingAPY ? stakingInfo.stakingAPY : 0);

        if (totalAPY === 0) {
          return <Typography>_</Typography>;
        }

        // For tCHR, show combined APY with tooltip breakdown
        if (row.symbol === 'tCHR') {
          return (
            <TooltipProvider>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 cursor-help">
                    <div className="flex items-center gap-1">
                      {hasStakingAPY && (
                        <div className="flex -space-x-1">
                          <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400" />
                          <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                        </div>
                      )}
                      <CountUp
                        value={totalAPY}
                        suffix="%"
                        className="text-sm font-semibold"
                        decimals={2}
                      />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="p-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <Typography variant="small">
                        Lending APY: {row.supplyAPY.toFixed(2)}%
                      </Typography>
                    </div>
                    {hasStakingAPY && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <Typography variant="small">
                          Staking APY: {stakingInfo.stakingAPY.toFixed(2)}%
                        </Typography>
                      </div>
                    )}
                    <div className="border-t border-border pt-2 mt-2">
                      <Typography variant="small" weight="semibold">
                        Total APY: {totalAPY.toFixed(2)}%
                      </Typography>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        }

        // For other assets, show simple APY
        return <CountUp value={row.supplyAPY} suffix="%" className="text-sm" decimals={2} />;
      },
      meta: {
        skeleton: <Skeleton className="w-20 h-5" />,
      },
    },
    {
      header: 'Staking Progress',
      accessorKey: 'symbol',
      cell: ({ row }) => {
        // Only show staking progress for tCHR
        if (row.symbol !== 'tCHR') {
          return <Typography className="text-muted-foreground text-sm">—</Typography>;
        }

        // Get supply records for this asset from lsdData
        const supplyRecords = lsdData?.supplyRecords || [];

        return renderStakingProgressPills(row.symbol, supplyRecords);
      },
      meta: {
        skeleton: <Skeleton className="w-32 h-10 rounded-md" />,
      },
    },
    {
      header: 'Collateral',
      accessorKey: 'usageAsCollateralEnabled',
      cell: ({ row }) => (
        <Switch
          checked={row.usageAsCollateralEnabled}
          onCheckedChange={() => handleCollateralSwitch(row)}
        />
      ),
      meta: {
        skeleton: <Skeleton className="w-10 h-5 rounded-full" />,
      },
    },
    {
      header: '',
      accessorKey: 'symbol',
      cell: ({ row }) => {
        return (
          <div className="flex justify-end">
            <div className="flex flex-col gap-2">
              <Button
                variant="gradient"
                className="w-[100px]"
                onClick={() => handleSupplyClick(row)}
              >
                Supply
              </Button>
              <Button
                variant="outlineGradient"
                className="w-[100px]"
                onClick={() => handleWithdrawClick(row)}
              >
                Withdraw
              </Button>
            </div>
          </div>
        );
      },
      meta: {
        skeleton: (
          <div className="flex justify-end">
            <div className="flex flex-col gap-2">
              <Skeleton className="w-[100px] h-9" />
              <Skeleton className="w-[100px] h-9" />
            </div>
          </div>
        ),
      },
    },
  ];

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-6">
      {isLoading || lsdLoading ? (
        <Skeleton className="h-8 w-48 mb-4" />
      ) : (
        <Typography variant="h4" weight="semibold" className="mb-4 text-2xl">
          Your Supply
        </Typography>
      )}
      {isLoading ? (
        <div className="space-y-4">
          <div className="flex gap-4 mb-4 flex-wrap">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-32" />
          </div>
          <SortableTable<UserReserveData>
            data={[]}
            columns={columns}
            pageSize={4}
            className="bg-transparent border-none"
            isLoading={true}
            skeletonRows={3}
          />
        </div>
      ) : (
        <>
          {positions.length > 0 ? (
            <>
              <div className="flex gap-4 mb-4 flex-wrap">
                <Badge variant="outline" className="text-base px-3 gap-1">
                  <Typography weight="medium">Balance:</Typography>
                  {yourSupplyBalancePosition ? (
                    <CountUp
                      value={yourSupplyBalancePosition}
                      prefix="$"
                      className="text-base ml-1"
                    />
                  ) : (
                    <Typography>_</Typography>
                  )}
                </Badge>
                <Badge variant="outline" className="text-base px-3 gap-1">
                  <Typography weight="medium">APY:</Typography>
                  {yourSupplyAPYPosition ? (
                    <CountUp
                      value={yourSupplyAPYPosition}
                      suffix="%"
                      className="text-base ml-1"
                      decimals={2}
                    />
                  ) : (
                    <Typography>_</Typography>
                  )}
                </Badge>
                <Badge variant="outline" className="text-base px-3 gap-1">
                  <Typography weight="medium">Collateral:</Typography>
                  {yourSupplyCollateralPosition ? (
                    <CountUp
                      value={yourSupplyCollateralPosition}
                      prefix="$"
                      className="text-base ml-1"
                    />
                  ) : (
                    <Typography>_</Typography>
                  )}
                </Badge>
              </div>
              <SortableTable<UserReserveData>
                data={positions}
                columns={columns}
                className="bg-transparent border-none"
              />
            </>
          ) : (
            <div className="flex flex-grow items-center justify-center">
              <Typography className="text-submerged text-center text-lg">
                No supply positions found. <br />
                Start supplying assets to earn interest.
              </Typography>
            </div>
          )}
        </>
      )}

      {/* Supply Dialog */}
      {selectedPosition && supplyDialogOpen && (
        <SupplyDialog
          open={supplyDialogOpen}
          onOpenChange={setSupplyDialogOpen}
          reserve={selectedPosition}
          mutateAssets={mutateAssets}
          accountData={accountData}
        />
      )}

      {/* Withdraw Dialog */}
      {selectedPosition && withdrawDialogOpen && (
        <WithdrawDialog
          open={withdrawDialogOpen}
          onOpenChange={setWithdrawDialogOpen}
          reserve={selectedPosition}
          mutateAssets={mutateAssets}
          accountData={accountData}
        />
      )}

      {/* Collateral Dialog */}
      {selectedCollateral && (
        <CollateralDialog
          open={collateralDialogOpen}
          onOpenChange={setCollateralDialogOpen}
          reserve={selectedCollateral}
          accountData={accountData}
          mutateAssets={mutateAssets}
        />
      )}

      {/* Staking Progress Dialog */}
      {selectedStakingAsset && (
        <StakingProgressDialog
          open={stakingProgressDialogOpen}
          onOpenChange={setStakingProgressDialogOpen}
          assetSymbol={selectedStakingAsset}
          selectedRecordIndex={selectedRecordIndex}
          lsdData={lsdData}
        />
      )}
    </div>
  );
};
