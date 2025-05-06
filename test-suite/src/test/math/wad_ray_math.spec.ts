// wad-ray-math.test.ts
import { BigNumber } from '@ethersproject/bignumber';
import { WAD, HALF_WAD, RAY, HALF_RAY, WAD_RAY_RATIO } from '@helpers/wadraymath';

describe('Wad Ray Math Tests', () => {
  test('getters', () => {
    expect(BigNumber.from(WAD).toString()).toBe('1000000000000000000');
    expect(BigNumber.from(HALF_WAD).toString()).toBe('500000000000000000');
    expect(BigNumber.from(RAY).toString()).toBe('1000000000000000000000000000');
    expect(BigNumber.from(HALF_RAY).toString()).toBe('500000000000000000000000000');
    expect(BigNumber.from(WAD_RAY_RATIO).toString()).toBe('1000000000');
  });

  test('wadMul', () => {
    const a = BigNumber.from(WAD).mul(134);
    const b = BigNumber.from(WAD).mul(13);

    expect(a.wadMul(BigNumber.from(0)).toString()).toBe('0');
    expect(BigNumber.from(0).wadMul(b).toString()).toBe('0');

    const x = a.wadMul(b);
    expect(x.toString()).toBe(BigNumber.from(WAD).mul(1742).toString());
  });

  test('wadMul edge cases', () => {
    const value = BigNumber.from(WAD).mul(1234);
    expect(value.wadMul(BigNumber.from(WAD)).toString()).toBe(value.toString());
  });

  test('wadMul rounding', () => {
    const a = BigNumber.from(WAD).mul(10);
    const b = BigNumber.from(WAD).mul(3);

    const x = a.wadMul(b);
    expect(x.toString()).toBe(BigNumber.from(WAD).mul(30).toString());
  });

  test('wadMul overflow', () => {
    const b = BigNumber.from(WAD).mul(13);
    const MAX_UINT256 = BigNumber.from(2).pow(256).sub(1);
    const tooLargeA = MAX_UINT256.sub(BigNumber.from(HALF_WAD)).div(b).add(1);

    expect(() => tooLargeA.wadMul(b)).toThrow();
  });

  test('wadDiv', () => {
    const a = BigNumber.from(WAD).mul(143);
    const b = BigNumber.from(WAD).mul(13);

    const x = a.wadDiv(b);
    expect(x.toString()).toBe(BigNumber.from(WAD).mul(11).toString());

    expect(() => a.wadDiv(BigNumber.from(0))).toThrow();
    expect(BigNumber.from(0).wadDiv(b).toString()).toBe('0');
  });

  test('wadDiv edge cases', () => {
    const value = BigNumber.from(WAD).mul(1234);
    expect(value.wadDiv(BigNumber.from(WAD)).toString()).toBe(value.toString());

    const a = BigNumber.from(WAD).mul(100);
    const b = BigNumber.from(WAD).mul(9);
    const x = a.wadDiv(b);
    expect(x.toString()).toBe('11111111111111111111');
  });

  test('wadDiv overflow', () => {
    const b = BigNumber.from(WAD).mul(13);
    const MAX_UINT256 = BigNumber.from(2).pow(256).sub(1);
    const tooLargeA = MAX_UINT256.sub(b.div(2)).div(BigNumber.from(WAD)).add(1);

    expect(() => tooLargeA.wadDiv(b)).toThrow();
  });

  test('rayMul', () => {
    const a = BigNumber.from(RAY).mul(134);
    const b = BigNumber.from(RAY).mul(13);

    expect(a.rayMul(BigNumber.from(0)).toString()).toBe('0');
    expect(BigNumber.from(0).rayMul(b).toString()).toBe('0');

    const x = a.rayMul(b);
    expect(x.toString()).toBe(BigNumber.from(RAY).mul(1742).toString());

    const c = BigNumber.from('134534543232342353231234');
    const d = BigNumber.from('13265462389132757665657');
    const y = c.rayMul(d);
    expect(y.toString()).toBe('1784662923287792467');
  });

  test('rayMul edge cases', () => {
    const value = BigNumber.from(RAY).mul(1234);
    expect(value.rayMul(BigNumber.from(RAY)).toString()).toBe(value.toString());
  });

  test('rayMul overflow', () => {
    const b = BigNumber.from(RAY).mul(13);
    const MAX_UINT256 = BigNumber.from(2).pow(256).sub(1);
    const tooLargeA = MAX_UINT256.sub(BigNumber.from(HALF_RAY)).div(b).add(1);

    expect(() => tooLargeA.rayMul(b)).toThrow();
  });

  test('rayDiv', () => {
    const a = BigNumber.from(RAY).mul(143);
    const b = BigNumber.from(RAY).mul(13);

    const x = a.rayDiv(b);
    expect(x.toString()).toBe(BigNumber.from(RAY).mul(11).toString());

    expect(() => a.rayDiv(BigNumber.from(0))).toThrow();
    expect(BigNumber.from(0).rayDiv(b).toString()).toBe('0');
  });

  test('rayDiv edge cases', () => {
    const value = BigNumber.from(RAY).mul(1234);
    expect(value.rayDiv(BigNumber.from(RAY)).toString()).toBe(value.toString());

    const a = BigNumber.from(RAY).mul(100);
    const b = BigNumber.from(RAY).mul(9);
    const x = a.rayDiv(b);
    expect(x.toString()).toBe('11111111111111111111111111111');
  });

  test('rayDiv overflow', () => {
    const b = BigNumber.from(RAY).mul(13);
    const MAX_UINT256 = BigNumber.from(2).pow(256).sub(1);
    const tooLargeA = MAX_UINT256.sub(b.div(2)).div(BigNumber.from(RAY)).add(1);

    expect(() => tooLargeA.rayDiv(b)).toThrow();
  });

  test('rayToWad', () => {
    const rayValue = BigNumber.from(RAY);
    const x = rayValue.rayToWad();
    expect(x.toString()).toBe(BigNumber.from(WAD).toString());

    const roundDown = BigNumber.from(RAY).add(BigNumber.from(WAD_RAY_RATIO).div(2).sub(1));
    const x2 = roundDown.rayToWad();
    expect(x2.toString()).toBe(BigNumber.from(WAD).toString());

    const roundUp = BigNumber.from(RAY).add(BigNumber.from(WAD_RAY_RATIO).div(2).add(1));
    const x3 = roundUp.rayToWad();
    expect(x3.toString()).toBe(BigNumber.from(WAD).add(1).toString());

    const MAX_UINT256 = BigNumber.from(2).pow(256).sub(1);
    const tooLarge = MAX_UINT256.sub(BigNumber.from(WAD_RAY_RATIO).div(2)).add(1);
    const x4 = tooLarge.rayToWad();
    expect(x4.toString()).toBe(
      '115792089237316195423570985008687907853269984665640564039457584007913'
    );
  });

  test('wadToRay', () => {
    const wadValue = BigNumber.from(WAD);
    const x = wadValue.wadToRay();
    expect(x.toString()).toBe(BigNumber.from(RAY).toString());
  });

  test('wadToRay overflow', () => {
    const MAX_UINT256 = BigNumber.from(2).pow(256).sub(1);
    const tooLarge = MAX_UINT256.div(BigNumber.from(WAD_RAY_RATIO)).add(1);

    expect(() => tooLarge.wadToRay()).toThrow();
  });
});
