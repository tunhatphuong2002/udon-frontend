import BigNumber from 'bignumber.js';
import { calculateHealthFactorFromBalancesBigUnits } from './pool-math';

export const calculateHFAfterSupply = (
  totalCollateralBeforeSupply: BigNumber,
  supplyAmount: BigNumber,
  currentLiquidationThreshold: BigNumber,
  formattedReserveLiquidationThreshold: BigNumber,
  totalCollateralMarketReferenceCurrency: BigNumber,
  totalBorrowsMarketReferenceCurrency: BigNumber,
  userHealFactor: BigNumber
) => {
  let healthFactorAfterDeposit = userHealFactor;
  // total collater after we supply = total_collater_before + amount_deposit_extra
  console.log('totalCollateralBeforeSupply', totalCollateralBeforeSupply.toString());
  console.log('supplyAmount', supplyAmount.toString());
  console.log('currentLiquidationThreshold', currentLiquidationThreshold.toString());
  console.log(
    'formattedReserveLiquidationThreshold',
    formattedReserveLiquidationThreshold.toString()
  );
  console.log(
    'totalCollateralMarketReferenceCurrency',
    totalCollateralMarketReferenceCurrency.toString()
  );
  console.log(
    'totalBorrowsMarketReferenceCurrency',
    totalBorrowsMarketReferenceCurrency.toString()
  );
  console.log('userHealFactor', userHealFactor.toString());
  const totalCollateralAfterSupply = totalCollateralBeforeSupply.plus(supplyAmount);
  console.log('totalCollateralAfterSupply', totalCollateralAfterSupply.toString());
  const liquidationThresholdAfter = totalCollateralMarketReferenceCurrency
    .multipliedBy(currentLiquidationThreshold)
    .plus(supplyAmount.multipliedBy(formattedReserveLiquidationThreshold))
    .dividedBy(totalCollateralAfterSupply)
    .dividedBy(100);

  console.log('liquidationThresholdAfter', liquidationThresholdAfter.toString());

  healthFactorAfterDeposit = calculateHealthFactorFromBalancesBigUnits({
    collateralBalanceMarketReferenceCurrency: totalCollateralAfterSupply,
    borrowBalanceMarketReferenceCurrency: totalBorrowsMarketReferenceCurrency,
    currentLiquidationThreshold: liquidationThresholdAfter,
  });

  console.log('healthFactorAfterDeposit', healthFactorAfterDeposit.toString());

  return healthFactorAfterDeposit;
};
