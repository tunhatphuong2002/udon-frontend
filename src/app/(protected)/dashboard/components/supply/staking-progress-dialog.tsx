'use client';

import React, { useState } from 'react';
import {
  Check,
  Clock,
  AlertCircle,
  Loader2,
  ArrowRight,
  TrendingUp,
  Wallet,
  Link,
  Coins,
  ExternalLink,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/common/dialog';
import { Typography } from '@/components/common/typography';
import { Badge } from '@/components/common/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/common/alert';
import CountUp from '@/components/common/count-up';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/common/card';
import { Button } from '@/components/common/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/common/tab/anim-underline';
import {
  StakingStatus,
  LsdFailureStage,
  UserLsdPosition,
  UserSupplyRecord,
  UserAccumulatedRewards,
} from '@/hooks/contracts/queries/use-lsd-position';
import { cn } from '@/utils/tailwind';
import { isTestnet } from '@/utils/env';

interface StakingProgressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assetSymbol: string;
  selectedRecordIndex?: number;
  lsdData?: {
    positions: UserLsdPosition[];
    supplyRecords: UserSupplyRecord[];
    rewards: UserAccumulatedRewards[];
  };
}

// Mapping từ string status sang enum number
const STAKING_STATUS_MAP: Record<string, StakingStatus> = {
  PENDING_STAKING: StakingStatus.PENDING_STAKING,
  CROSS_CHAIN_TRANSFERRING_TO_ECONOMY: StakingStatus.CROSS_CHAIN_TRANSFERRING_TO_ECONOMY,
  BRIDGING_TO_BSC: StakingStatus.BRIDGING_TO_BSC,
  TRANSFER_TO_USER: StakingStatus.TRANSFER_TO_USER,
  APPROVE_ERC20: StakingStatus.APPROVE_ERC20,
  STAKED: StakingStatus.STAKED,
};

// Mapping từ string failure stage sang enum number
const LSD_FAILURE_STAGE_MAP: Record<string, LsdFailureStage> = {
  NO_FAILURE: LsdFailureStage.NO_FAILURE,
  STAKING_TRANSFER_ECONOMY: LsdFailureStage.STAKING_TRANSFER_ECONOMY,
  STAKING_BRIDGING_BSC: LsdFailureStage.STAKING_BRIDGING_BSC,
  STAKING_TRANSFER_USER_BSC: LsdFailureStage.STAKING_TRANSFER_USER_BSC,
  STAKING_APPROVE_ERC20_BSC: LsdFailureStage.STAKING_APPROVE_ERC20_BSC,
  STAKING_HANDLE: LsdFailureStage.STAKING_HANDLE,
  S_WITHDRAW_REQUEST: LsdFailureStage.S_WITHDRAW_REQUEST,
  S_WITHDRAW_HANDLE: LsdFailureStage.S_WITHDRAW_HANDLE,
  S_WITHDRAW_BRIDGE_ASSET: LsdFailureStage.S_WITHDRAW_BRIDGE_ASSET,
  S_WITHDRAW_TRANSFER_UDON: LsdFailureStage.S_WITHDRAW_TRANSFER_UDON,
  Q_WITHDRAW_TRANSFER_DEX: LsdFailureStage.Q_WITHDRAW_TRANSFER_DEX,
  Q_WITHDRAW_HANDLE_SWAP: LsdFailureStage.Q_WITHDRAW_HANDLE_SWAP,
  Q_WITHDRAW_TRANSFER_UDON: LsdFailureStage.Q_WITHDRAW_TRANSFER_UDON,
};

const STAKING_STEPS = [
  {
    status: StakingStatus.PENDING_STAKING,
    label: 'Pending Staking',
    description: 'Your staking request has been created and is waiting to be processed',
    icon: Clock,
  },
  {
    status: StakingStatus.CROSS_CHAIN_TRANSFERRING_TO_ECONOMY,
    label: 'Cross-chain Transfer',
    description: 'Transferring CHR from Udon pool to the economy chain',
    icon: ArrowRight,
  },
  {
    status: StakingStatus.BRIDGING_TO_BSC,
    label: 'Bridging to BSC',
    description: 'Bridging your assets from Chromia to BSC network',
    icon: Link,
  },
  {
    status: StakingStatus.TRANSFER_TO_USER,
    label: 'Wallet Setup',
    description: 'Transferring to your dedicated staking wallet on BSC',
    icon: Wallet,
  },
  {
    status: StakingStatus.APPROVE_ERC20,
    label: 'Token Approval',
    description: 'Approving CHR tokens for the staking contract',
    icon: Check,
  },
  {
    status: StakingStatus.STAKED,
    label: 'Successfully Staked',
    description: 'Your CHR is now staked and earning rewards!',
    icon: Coins,
  },
];

const FAILURE_STAGE_MESSAGES = {
  [LsdFailureStage.NO_FAILURE]: 'No issues detected',
  [LsdFailureStage.STAKING_TRANSFER_ECONOMY]:
    'Failed during cross-chain transfer to economy chain. Please contact support.',
  [LsdFailureStage.STAKING_BRIDGING_BSC]:
    'Failed while bridging to BSC network. The bridge may be temporarily unavailable.',
  [LsdFailureStage.STAKING_TRANSFER_USER_BSC]:
    'Failed during transfer to your BSC staking wallet. Please try again later.',
  [LsdFailureStage.STAKING_APPROVE_ERC20_BSC]:
    'Failed during ERC20 token approval. This may be a temporary issue.',
  [LsdFailureStage.STAKING_HANDLE]:
    'Failed during the staking transaction. Please ensure sufficient gas fees.',
  [LsdFailureStage.S_WITHDRAW_REQUEST]: 'Failed during slow withdraw request submission.',
  [LsdFailureStage.S_WITHDRAW_HANDLE]: 'Failed during slow withdraw execution.',
  [LsdFailureStage.S_WITHDRAW_BRIDGE_ASSET]: 'Failed during asset bridging back to Chromia.',
  [LsdFailureStage.S_WITHDRAW_TRANSFER_UDON]: 'Failed during final transfer to your Udon wallet.',
  [LsdFailureStage.Q_WITHDRAW_TRANSFER_DEX]: 'Failed during quick withdraw transfer to DEX.',
  [LsdFailureStage.Q_WITHDRAW_HANDLE_SWAP]: 'Failed during DEX swap execution.',
  [LsdFailureStage.Q_WITHDRAW_TRANSFER_UDON]: 'Failed during quick withdraw final transfer.',
};

// Helper function to get BSC explorer URL
const getBscExplorerUrl = (address: string): string => {
  const baseUrl = isTestnet ? 'https://testnet.bscscan.com' : 'https://bscscan.com';
  return `${baseUrl}/address/${address}`;
};

export const StakingProgressDialog: React.FC<StakingProgressDialogProps> = ({
  open,
  onOpenChange,
  assetSymbol,
  selectedRecordIndex = 0,
  lsdData,
}) => {
  const [activeTab, setActiveTab] = useState(selectedRecordIndex.toString());

  // Sync activeTab with selectedRecordIndex when dialog opens or selectedRecordIndex changes
  React.useEffect(() => {
    if (open && selectedRecordIndex !== undefined) {
      setActiveTab(selectedRecordIndex.toString());
    }
  }, [open, selectedRecordIndex]);

  if (assetSymbol !== 'tCHR' || !lsdData) {
    return null;
  }

  const { positions, supplyRecords, rewards } = lsdData;
  console.log('lsdData', lsdData);

  // If no supply records found
  if (!supplyRecords || supplyRecords.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Staking Progress</DialogTitle>
          </DialogHeader>
          <div className="py-8 text-center">
            <Typography className="text-muted-foreground">
              No staking records found for {assetSymbol}
            </Typography>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Get current active record
  const currentRecordIndex = parseInt(activeTab);
  const supplyRecord = supplyRecords[currentRecordIndex];
  const position = positions[0]; // Position is shared across records
  const reward = rewards[0]; // Rewards are accumulated across all records

  if (!supplyRecord) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Staking Progress</DialogTitle>
          </DialogHeader>
          <div className="py-8 text-center">
            <Typography className="text-muted-foreground">
              Selected staking record not found
            </Typography>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Convert string status to enum number
  const currentStatusString = supplyRecord.stakingStatus;
  const currentStatus =
    typeof currentStatusString === 'string'
      ? (STAKING_STATUS_MAP[currentStatusString as string] ?? StakingStatus.PENDING_STAKING)
      : (currentStatusString as number);

  // Convert position status from string to enum number
  const positionStatusString = position.status;
  const positionStatus =
    typeof positionStatusString === 'string'
      ? (LSD_FAILURE_STAGE_MAP[positionStatusString as string] ?? LsdFailureStage.NO_FAILURE)
      : (positionStatusString as number);

  const hasError = positionStatus !== LsdFailureStage.NO_FAILURE;
  const isStaked = currentStatus === StakingStatus.STAKED;
  const completedSteps = isStaked
    ? STAKING_STEPS.length
    : STAKING_STEPS.filter(step => step.status < currentStatus).length;
  const totalSteps = STAKING_STEPS.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  // Calculate staking APY for current record
  let stakingAPY = 0;
  if (isStaked && reward && reward.totalStakingRewards > 0 && reward.bscStakeAmount > 0) {
    stakingAPY = (reward.totalStakingRewards / reward.bscStakeAmount) * 100 * 365; // Annualized
  }

  // Format supply record info
  const formatSupplyAmount = (amount: number | bigint): string => {
    const numAmount = typeof amount === 'bigint' ? Number(amount) : amount;
    return (numAmount / 1e6).toFixed(2); // Convert from microunits
  };

  const formatDate = (timestamp: string) => {
    return new Date(Number(timestamp)).toLocaleDateString();
  };

  const getStepIcon = (step: (typeof STAKING_STEPS)[0], stepStatus: StakingStatus) => {
    const Icon = step.icon;
    if (hasError && stepStatus === currentStatus) {
      return <AlertCircle className="w-4 h-4 text-white" />;
    }
    if (stepStatus < currentStatus || (stepStatus === currentStatus && isStaked)) {
      return <Icon className="w-4 h-4 text-white" />;
    }
    if (stepStatus === currentStatus) {
      return <Loader2 className="w-4 h-4 text-white animate-spin" />;
    }
    return <Icon className="w-4 h-4 text-muted-foreground" />;
  };

  const getStepStatus = (stepStatus: StakingStatus) => {
    if (hasError && stepStatus === currentStatus) {
      return 'error';
    }
    if (stepStatus < currentStatus || (stepStatus === currentStatus && isStaked)) {
      return 'completed';
    }
    if (stepStatus === currentStatus) {
      return 'current';
    }
    return 'pending';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Staking Progress - {assetSymbol}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Staking Summary - Always show */}
          <Card className="bg-gradient-to-br from-card to-emerald-500/5 border-emerald-200/30 dark:border-emerald-800/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-500">
                  <Coins className="w-4 h-4 text-white" />
                </div>
                Staking Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 p-3 rounded-lg border border-border/50 bg-gradient-to-br from-card to-primary/5">
                  <Typography variant="small" className="text-muted-foreground font-medium">
                    Total Staked
                  </Typography>
                  <CountUp
                    // value={reward.bscStakeAmount}
                    value={0}
                    suffix=" CHR"
                    decimals={2}
                    className="text-xl font-bold"
                  />
                </div>

                <div className="space-y-1 p-3 rounded-lg border border-emerald-200/30 bg-gradient-to-br from-card to-emerald-500/10">
                  <Typography variant="small" className="text-muted-foreground font-medium">
                    Total Rewards
                  </Typography>
                  <CountUp
                    // value={reward.totalStakingRewards}
                    value={0}
                    suffix=" CHR"
                    decimals={4}
                    className="text-xl font-bold text-emerald-600 dark:text-emerald-400"
                  />
                </div>

                <div className="space-y-1 p-3 rounded-lg border border-blue-200/30 bg-gradient-to-br from-card to-blue-500/10">
                  <Typography variant="small" className="text-muted-foreground font-medium">
                    Current Rewards
                  </Typography>
                  <CountUp
                    // value={reward.currentStakingRewards}
                    value={0}
                    suffix=" CHR"
                    decimals={4}
                    className="text-xl font-bold text-blue-600 dark:text-blue-400"
                  />
                </div>

                <div className="space-y-1 p-3 rounded-lg border border-border/50 bg-gradient-to-br from-card to-muted/10">
                  <Typography variant="small" className="text-muted-foreground font-medium">
                    Last Update
                  </Typography>
                  <Typography className="text-sm font-medium">
                    {reward ? new Date(Number(reward.lastUpdateTimestamp)).toLocaleString() : 'N/A'}
                  </Typography>
                </div>
              </div>

              {reward && reward.bscStakingAddress && (
                <div className="mt-4 p-4 bg-gradient-to-r from-muted/30 to-muted/10 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Typography
                        variant="small"
                        className="text-muted-foreground mb-1 font-medium"
                      >
                        BSC Staking Address
                      </Typography>
                      <Typography className="text-xs font-mono break-all text-foreground/80">
                        {reward.bscStakingAddress}
                      </Typography>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-3 flex-shrink-0"
                      onClick={() =>
                        window.open(getBscExplorerUrl(reward.bscStakingAddress), '_blank')
                      }
                    >
                      <ExternalLink className="mr-1 h-3 w-3" />
                      BSCScan
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Important Information - Always show */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important Information</AlertTitle>
            <AlertDescription className="mt-2 space-y-2">
              <p>
                The staking process involves multiple blockchain networks and may take 5-10 minutes
                to complete.
              </p>
              <p>
                Your staking rewards are automatically compounded and will be reflected in your
                total balance.
              </p>
              {hasError && (
                <p className="font-medium">
                  If you continue to experience issues, please contact our support team with your
                  wallet address.
                </p>
              )}
            </AlertDescription>
          </Alert>

          {/* Supply Records - Always show with improved layout */}
          {supplyRecords.length > 1 ? (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Supply Records</CardTitle>
                <CardDescription>
                  Select a supply record to view its staking progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  {/* Tabs with primary underline */}
                  <TabsList className="justify-center bg-transparent p-0 h-auto border-b border-border">
                    {supplyRecords.map((record, index) => (
                      <TabsTrigger
                        key={index}
                        value={index.toString()}
                        className="px-6 py-3 text-sm font-medium data-[state=active]:text-embossed data-[state=inactive]:text-muted-foreground hover:text-foreground transition-colors border-b-2 border-transparent data-[state=active]:border-primary"
                      >
                        Supply #{index + 1}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {/* Tab Contents with proper grid layout */}
                  {supplyRecords.map((record, index) => (
                    <TabsContent key={index} value={index.toString()} className="mt-6">
                      <div className="space-y-4">
                        {/* Main info in a clean grid */}
                        <div className="grid grid-cols-3 gap-4 p-4 bg-muted/20 rounded-lg border">
                          <div>
                            <Typography variant="small" className="text-muted-foreground mb-1">
                              Amount
                            </Typography>
                            <Typography weight="semibold" className="text-lg">
                              {formatSupplyAmount(record.netAmount)} CHR
                            </Typography>
                          </div>
                          <div>
                            <Typography variant="small" className="text-muted-foreground mb-1">
                              Supply Date
                            </Typography>
                            <Typography weight="semibold" className="text-lg">
                              {formatDate(record.createdAt)}
                            </Typography>
                          </div>
                          <div>
                            <Typography variant="small" className="text-muted-foreground mb-1">
                              Status
                            </Typography>
                            <Badge variant="outline" className="text-sm">
                              {typeof record.stakingStatus === 'string'
                                ? record.stakingStatus.replace(/_/g, ' ')
                                : 'Unknown'}
                            </Badge>
                          </div>
                        </div>

                        {/* Additional details in a 2-column grid */}
                        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/10 rounded-lg border">
                          <div>
                            <Typography variant="small" className="text-muted-foreground mb-1">
                              Expected Amount
                            </Typography>
                            <Typography weight="medium" className="text-base">
                              {formatSupplyAmount(record.expectedAmount)} CHR
                            </Typography>
                          </div>
                          <div>
                            <Typography variant="small" className="text-muted-foreground mb-1">
                              Supply Fee
                            </Typography>
                            <Typography weight="medium" className="text-base">
                              {formatSupplyAmount(record.supplyFee)} CHR
                            </Typography>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            /* Single supply record with proper grid */
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Supply Record</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Main info in a clean grid */}
                  <div className="grid grid-cols-3 gap-4 p-4 bg-muted/20 rounded-lg border">
                    <div>
                      <Typography variant="small" className="text-muted-foreground mb-1">
                        Amount
                      </Typography>
                      <Typography weight="semibold" className="text-lg">
                        {formatSupplyAmount(supplyRecord.netAmount)} CHR
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="small" className="text-muted-foreground mb-1">
                        Supply Date
                      </Typography>
                      <Typography weight="semibold" className="text-lg">
                        {formatDate(supplyRecord.createdAt)}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="small" className="text-muted-foreground mb-1">
                        Status
                      </Typography>
                      <Badge variant="outline" className="text-sm">
                        {typeof supplyRecord.stakingStatus === 'string'
                          ? supplyRecord.stakingStatus.replace(/_/g, ' ')
                          : 'Unknown'}
                      </Badge>
                    </div>
                  </div>

                  {/* Additional details in a 2-column grid */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-muted/10 rounded-lg border">
                    <div>
                      <Typography variant="small" className="text-muted-foreground mb-1">
                        Expected Amount
                      </Typography>
                      <Typography weight="medium" className="text-base">
                        {formatSupplyAmount(supplyRecord.expectedAmount)} CHR
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="small" className="text-muted-foreground mb-1">
                        Supply Fee
                      </Typography>
                      <Typography weight="medium" className="text-base">
                        {formatSupplyAmount(supplyRecord.supplyFee)} CHR
                      </Typography>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Progress Overview */}
          <Card className="border-primary/20 bg-gradient-to-r from-card via-card to-primary/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Current Status</CardTitle>
                  <CardDescription className="mt-1">
                    {STAKING_STEPS.find(step => step.status === currentStatus)?.label || 'Unknown'}
                  </CardDescription>
                </div>
                <Badge
                  variant={isStaked ? 'default' : hasError ? 'destructive' : 'secondary'}
                  className={cn(
                    'h-8 px-3',
                    isStaked &&
                      'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                  )}
                >
                  {isStaked ? '✨ Staked' : hasError ? 'Error' : 'Processing'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">
                      {completedSteps} of {totalSteps} steps
                    </span>
                  </div>
                  {/* Progress bar implementation */}
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className={cn(
                        'h-full transition-all duration-500 ease-in-out rounded-full',
                        isStaked ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-primary'
                      )}
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>

                {isStaked && stakingAPY > 0 && (
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      <Typography variant="small" className="text-muted-foreground font-medium">
                        Estimated Staking APY
                      </Typography>
                    </div>
                    <CountUp
                      value={stakingAPY}
                      suffix="%"
                      decimals={2}
                      className="text-lg font-bold text-emerald-600 dark:text-emerald-400"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Error Alert */}
          {hasError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Staking Error</AlertTitle>
              <AlertDescription className="mt-2">
                {FAILURE_STAGE_MESSAGES[positionStatus as LsdFailureStage] ||
                  'An unknown error occurred during staking.'}
              </AlertDescription>
            </Alert>
          )}

          {/* Progress Steps */}
          <div className="space-y-4">
            <Typography variant="h5" weight="semibold">
              Staking Journey
            </Typography>

            <div className="space-y-3">
              {STAKING_STEPS.map((step, index) => {
                const stepStatusType = getStepStatus(step.status);
                const isLast = index === STAKING_STEPS.length - 1;

                return (
                  <div key={step.status} className="relative">
                    {!isLast && (
                      <div
                        className={cn(
                          'absolute left-[29px] top-[45px] w-0.5 h-[calc(80%)]',
                          stepStatusType === 'completed'
                            ? 'bg-gradient-to-b from-emerald-500 to-green-500'
                            : 'bg-border/30'
                        )}
                      />
                    )}

                    <div
                      className={cn(
                        'flex items-start gap-4 p-4 rounded-lg border-2 transition-all relative z-10',
                        stepStatusType === 'completed' &&
                          'bg-gradient-to-r from-emerald-50/50 to-green-50/50 dark:from-emerald-950/20 dark:to-green-950/20 border-emerald-200/50 dark:border-emerald-800/50',
                        stepStatusType === 'current' &&
                          !hasError &&
                          'bg-gradient-to-r from-primary/5 to-blue-500/5 border-primary/30 shadow-sm ring-1 ring-primary/10',
                        stepStatusType === 'error' &&
                          'bg-gradient-to-r from-destructive/5 to-red-500/5 border-destructive/30',
                        stepStatusType === 'pending' && 'bg-muted/10 border-muted/20'
                      )}
                    >
                      <div
                        className={cn(
                          'flex-shrink-0 mt-0.5 rounded-full p-2 ring-2 ring-offset-2',
                          stepStatusType === 'completed' &&
                            'bg-gradient-to-r from-emerald-500 to-green-500 ring-emerald-500/30 ring-offset-card',
                          stepStatusType === 'current' &&
                            !hasError &&
                            'bg-gradient-to-r from-primary to-blue-500 ring-primary/30 ring-offset-card',
                          stepStatusType === 'error' &&
                            'bg-gradient-to-r from-destructive to-red-500 ring-destructive/30 ring-offset-card',
                          stepStatusType === 'pending' && 'bg-muted ring-muted/30 ring-offset-card'
                        )}
                      >
                        {getStepIcon(step, step.status)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <Typography
                            weight="semibold"
                            className={cn(
                              stepStatusType === 'completed' &&
                                'text-emerald-700 dark:text-emerald-400',
                              stepStatusType === 'current' && !hasError && 'text-primary',
                              stepStatusType === 'error' && 'text-destructive',
                              stepStatusType === 'pending' && 'text-muted-foreground'
                            )}
                          >
                            {step.label}
                          </Typography>

                          <Badge
                            variant={
                              stepStatusType === 'completed'
                                ? 'default'
                                : stepStatusType === 'current' && !hasError
                                  ? 'secondary'
                                  : stepStatusType === 'error'
                                    ? 'destructive'
                                    : 'outline'
                            }
                            className={cn(
                              'text-xs h-5 font-medium',
                              stepStatusType === 'completed' &&
                                'bg-gradient-to-r from-emerald-600 to-green-600 text-white border-none'
                            )}
                          >
                            {stepStatusType === 'completed'
                              ? '✓ Complete'
                              : stepStatusType === 'current' && !hasError
                                ? 'In Progress'
                                : stepStatusType === 'error'
                                  ? '✗ Failed'
                                  : `Step ${index + 1}`}
                          </Badge>
                        </div>

                        <Typography
                          variant="small"
                          className={cn(
                            stepStatusType === 'completed' &&
                              'text-emerald-600/80 dark:text-emerald-400/80',
                            stepStatusType === 'current' && !hasError && 'text-primary/70',
                            stepStatusType === 'error' && 'text-destructive/70',
                            stepStatusType === 'pending' && 'text-muted-foreground/70'
                          )}
                        >
                          {step.description}
                        </Typography>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
