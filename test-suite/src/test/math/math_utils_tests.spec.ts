import { BigNumber } from '@ethersproject/bignumber';
import { PERCENTAGE_FACTOR, HALF_PERCENTAGE, WAD, RAY, ONE_YEAR } from '@/helpers/wadraymath';

// Utility functions to mimic the Rell core.math functions
function getSecondsPerYear(): number {
  return parseInt(ONE_YEAR);
}

function getPercentageFactor(): string {
  return PERCENTAGE_FACTOR;
}

function getHalfPercentageFactor(): string {
  return HALF_PERCENTAGE;
}

// Power function implementation
function pow(base: number, exponent: number): BigNumber {
  return BigNumber.from(base).pow(exponent);
}

// Interest calculation functions
function calculateLinearInterest(
  rate: BigNumber,
  lastUpdateTimestamp: number,
  currentTime: number
): BigNumber {
  const timeDiff = BigNumber.from(currentTime - lastUpdateTimestamp);
  return BigNumber.from(RAY).add(
    rate.sub(BigNumber.from(RAY)).mul(timeDiff).div(BigNumber.from(ONE_YEAR))
  );
}

function calculateCompoundedInterest(
  rate: BigNumber,
  lastUpdateTimestamp: number,
  currentTime: number
): BigNumber {
  if (lastUpdateTimestamp === currentTime) {
    return BigNumber.from(RAY);
  }

  const timeDiff = BigNumber.from(currentTime - lastUpdateTimestamp);
  const ratePerSecond = rate.rayDiv(BigNumber.from(ONE_YEAR).wadToRay());
  return ratePerSecond.rayPow(timeDiff);
}

describe('Math Utils Tests', () => {
  test('constants', () => {
    expect(getSecondsPerYear()).toBe(365 * 24 * 3600);
    expect(getPercentageFactor()).toBe('10000');
    expect(getHalfPercentageFactor()).toBe('5000');
  });

  test('percent_mul', () => {
    const value = BigNumber.from(WAD);
    const percentage = BigNumber.from(HALF_PERCENTAGE);

    const result = value.percentMul(percentage);
    expect(result.toString()).toBe(BigNumber.from(WAD).div(2).toString());

    expect(BigNumber.from(0).percentMul(percentage).toString()).toBe('0');
    expect(value.percentMul(0).toString()).toBe('0');
  });

  test('percent_mul_max_percentage', () => {
    const maxPercentage = BigNumber.from(PERCENTAGE_FACTOR);
    const value = BigNumber.from(WAD);

    expect(value.percentMul(maxPercentage).toString()).toBe(value.toString());
  });

  test('percent_mul_overflow', () => {
    const percentage = BigNumber.from(HALF_PERCENTAGE);
    const MAX_UINT256 = BigNumber.from(2).pow(256).sub(1);
    const tooLargeA = MAX_UINT256.sub(BigNumber.from(HALF_PERCENTAGE)).div(percentage).add(1);

    expect(() => tooLargeA.percentMul(percentage)).toThrow();
  });

  test('percent_div', () => {
    const value = BigNumber.from(WAD).div(2);
    const percentage = BigNumber.from(HALF_PERCENTAGE);

    const result = value.percentDiv(percentage);
    expect(result.toString()).toBe(BigNumber.from(WAD).toString());

    expect(BigNumber.from(0).percentDiv(percentage).toString()).toBe('0');
  });

  test('percent_div_max_percentage', () => {
    const maxPercentage = BigNumber.from(PERCENTAGE_FACTOR);
    const value = BigNumber.from(WAD);

    expect(value.percentDiv(maxPercentage).toString()).toBe(value.toString());
  });

  test('percent_div_overflow', () => {
    const percentage = BigNumber.from(HALF_PERCENTAGE);
    const MAX_UINT256 = BigNumber.from(2).pow(256).sub(1);
    const tooLargeA = MAX_UINT256.sub(BigNumber.from(HALF_PERCENTAGE))
      .div(BigNumber.from(PERCENTAGE_FACTOR))
      .add(1);

    expect(() => tooLargeA.percentDiv(percentage)).toThrow();
  });

  test('percent_div_by_zero', () => {
    const value = BigNumber.from(WAD).div(2);

    expect(() => value.percentDiv(0)).toThrow();
  });

  test('pow', () => {
    expect(pow(2, 3).toString()).toBe('8');
    expect(pow(10, 0).toString()).toBe('1');
    expect(pow(0, 5).toString()).toBe('0');
    expect(pow(1, 100).toString()).toBe('1');
    expect(pow(10, 9).toString()).toBe('1000000000');
  });

  test('pow_edge_cases', () => {
    expect(pow(0, 0).toString()).toBe('1');
    expect(pow(1, 1).toString()).toBe('1');
    expect(pow(10, 1).toString()).toBe('10');
  });

  test('linear_interest_one_year', () => {
    const rate = BigNumber.from(RAY);
    const currentTime = 1000000000;
    const lastUpdateTimestamp = currentTime - getSecondsPerYear();

    const result = calculateLinearInterest(rate, lastUpdateTimestamp, currentTime);
    expect(result.toString()).toBe(BigNumber.from(RAY).mul(2).toString());
  });

  test('compounded_interest_one_year', () => {
    const rate = BigNumber.from(RAY);
    const currentTime = 1000000000;
    const lastUpdateTimestamp = currentTime - getSecondsPerYear();

    const result = calculateCompoundedInterest(rate, lastUpdateTimestamp, currentTime);
    expect(result.toString()).toBe('2666663803286306996604104000');
  });

  test('compounded_interest_one_month', () => {
    const rate = BigNumber.from('120000000000000000000000000'); // 0.12 RAY (12%)
    const lastUpdateTimestamp = 1000000000;
    const currentTimestamp = 1000000000 + 2628000; // 1 month (30.5 days)

    const result = calculateCompoundedInterest(rate, lastUpdateTimestamp, currentTimestamp);
    expect(result.toString()).toBe('1010050166355574026738200000');
  });

  test('compounded_interest_zero_time', () => {
    const rate = BigNumber.from(RAY);
    const timestamp = 1000000000;

    const result = calculateCompoundedInterest(rate, timestamp, timestamp);
    expect(result.toString()).toBe(RAY);
  });
});
