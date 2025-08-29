export interface AssetPrice {
  stork_asset_id: string;
  price: number;
  timestamp: string;
  asset_symbol: string;
}

export interface UserReserveDataResponse {
  // Asset fields
  assetId: Buffer<ArrayBufferLike>;
  name: string;
  symbol: string;
  decimals: number;
  iconUrl: string;
  type: string;
  totalSupply: bigint;
  balance: bigint;

  // Reserve fields
  reserveUnbacked: bigint;
  reserveAccruedToTreasury: bigint;
  currentATokenBalance: bigint;
  currentATokenTotalSupply: bigint;
  currentVariableDebt: bigint;
  currentVariableDebtTokenTotalSupply: bigint;
  reserveCurrentLiquidityRate: bigint;
  reserveCurrentVariableBorrowRate: bigint;
  reserveLiquidityIndex: bigint;
  reserveVariableBorrowIndex: bigint;
  usageAsCollateralEnabled: 1 | 0;
  reserveLastUpdateTimestamp: bigint;

  supplyCap: bigint;
  borrowCap: bigint;
  ltv: bigint;

  liquidationThreshold: bigint;

  availableLiquidity: bigint;

  // userDataAccount: UserAccountDataResponse;
}

export interface UserReserveData {
  assetId: Buffer<ArrayBufferLike>;
  name: string;
  symbol: string;
  decimals: number;
  iconUrl: string;
  type: string;
  totalSupply: number;
  balance: number;
  // isLsd: boolean;
  // Reserve fields
  reserveUnbacked: number;
  reserveAccruedToTreasury: number;
  currentATokenBalance: number;
  currentATokenTotalSupply: number;
  currentVariableDebt: number;
  currentVariableDebtTokenTotalSupply: number;
  reserveCurrentLiquidityRate: number;
  reserveCurrentVariableBorrowRate: number;
  reserveLiquidityIndex: number;
  reserveVariableBorrowIndex: number;
  usageAsCollateralEnabled: boolean;
  reserveLastUpdateTimestamp: number;

  price: number;
  supplyAPY: number;
  borrowAPY: number;

  supplyCap: number;
  borrowCap: number;
  ltv: number;

  liquidationThreshold: number;

  availableLiquidity: number;

  reserve_factor: number;

  // userDataAccount: UserAccountData;
}

export interface UserAccountDataResponse {
  totalCollateralBase: bigint;
  totalDebtBase: bigint;
  availableBorrowsBase: bigint;
  currentLiquidationThreshold: bigint;
  ltv: bigint;
  healthFactor: bigint;
}

export interface UserAccountData {
  totalCollateralBase: number;
  totalDebtBase: number;
  availableBorrowsBase: number;
  currentLiquidationThreshold: number;
  ltv: number;
  healthFactor: number;
  healthFactorFormatted: number;
}

export interface AvailableLiquidityToken {
  assetId: Buffer<ArrayBufferLike>;
  symbol: string;
  availableLiquidityToken: number;
}

export enum StakingStatus {
  PENDING_STAKING,
  CROSS_TRANSFER_TO_EC,
  STAKED,
}

export enum UnstakingStatus {
  PENDING_REQUEST,
  PENDING_UNSTAKING_14D,
  CROSS_TRANSFER_TO_UDON,
  UNSTAKED,
  CLAIMED,
}

export enum LsdFailureStatus {
  NO_FAILURE,
  STAKING_CROSS_TRANSFER_EC,
  STAKING_HANDLE,
  UNSTAKING_REQUEST,
  UNSTAKING_HANDLE,
  UNSTAKING_CROSS_TRANSFER_UDON,
}

export enum ClaimStatus {
  PENDING_CLAIM,
  CLAIMED,
}

export type ClaimPosition = {
  positionId: Buffer<ArrayBufferLike>;
  userId: Buffer<ArrayBufferLike>;
  underlyingAssetId: Buffer<ArrayBufferLike>;
  rewardAmount: number;
  claimStatus: ClaimStatus;
  failureStage: LsdFailureStatus;
  txClaim: string;
  txCrossChain: string;
  requestedAt: number;
  completedAt: number;
  isActive: boolean;
};

export type UnstakingPosition = {
  positionId: Buffer<ArrayBufferLike>;
  userId: Buffer<ArrayBufferLike>;
  underlyingAssetId: Buffer<ArrayBufferLike>;
  expectedAmount: number;
  netAmount: number;
  unstakingStatus: UnstakingStatus;
  failureStage: LsdFailureStatus;
  txUnstaking: string;
  txCrossChain: string;
  requestedAt: number;
  availableAt: number;
  completedAt: number;
  isActive: boolean;
};

export type ClaimHistory = {
  id: Buffer<ArrayBufferLike>;
  userId: Buffer<ArrayBufferLike>;
  underlyingAssetId: Buffer<ArrayBufferLike>;
  rewardAmount: number;
  claimStatus: ClaimStatus;
  failureStage: LsdFailureStatus;
  txCrossChain: string;
  completedAt: number;
};

export type StakingPosition = {
  positionId: Buffer<ArrayBufferLike>;
  userId: Buffer<ArrayBufferLike>;
  underlyingAssetId: Buffer<ArrayBufferLike>;
  expectedAmount: number;
  netAmount: number;
  creationEcFee: number;
  stakingStatus: StakingStatus;
  failureStage: LsdFailureStatus;
  txStaking: string;
  txCrossChain: string;
  createdAt: number;
  completedAt: number;
  isActive: boolean;
};
