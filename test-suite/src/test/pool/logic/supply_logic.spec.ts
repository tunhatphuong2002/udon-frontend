import { op, Session } from '@chromia/ft4';
import { IClient } from 'postchain-client';
import { admin_kp, user_a_kp, user_b_kp } from '@configs/key-pair';
import { registerAccountOpen } from '@common/operations/accounts';
import { getClient } from '@/clients';

describe('Supply Logic', () => {
  let adminSession: Session;
  let userASession: Session;
  let userBSession: Session;
  let client: IClient;
  let adminAccountId: Buffer<ArrayBufferLike>;
  let userAAccountId: Buffer<ArrayBufferLike>;
  let userBAccountId: Buffer<ArrayBufferLike>;
  let underlyingAssetId: Buffer<ArrayBufferLike>;
  let aAssetId: Buffer<ArrayBufferLike>;

  beforeAll(async () => {
    // get client
    client = await getClient();

    // Setup sessions
    adminSession = await registerAccountOpen(client, admin_kp);
    adminAccountId = adminSession.account.id;

    userASession = await registerAccountOpen(client, user_a_kp);
    userAAccountId = userASession.account.id;

    userBSession = await registerAccountOpen(client, user_b_kp);
    userBAccountId = userBSession.account.id;

    // Initialize ACL module
    await adminSession.call(op('initialize', admin_kp.pubKey));
    await adminSession.call(op('grant_role', 'POOL_ADMIN', adminAccountId, admin_kp.pubKey));

    // Setup environment for supply tests
    // 1. Initialize asset base
    await adminSession.call(op('initialize_asset_base'));

    // 2. Initialize underlying asset factory
    await adminSession.call(op('initialize_underlying_asset_factory'));

    // 3. Initialize a_asset factory
    await adminSession.call(op('initialize_a_asset_factory'));

    // 4. Create underlying asset
    const underlyingAsset = {
      name: 'Test Underlying Token',
      symbol: 'TUT',
      decimals: 6,
      icon: 'http://example.com/icon.png',
    };

    const resultCreateUnderlyingAsset = await adminSession.call(
      op(
        'create_underlying_asset',
        underlyingAsset.name,
        underlyingAsset.symbol,
        underlyingAsset.decimals,
        underlyingAsset.icon
      )
    );

    console.log('resultCreateUnderlyingAsset', resultCreateUnderlyingAsset);

    const underlyingAssetResult = await adminSession.getAssetsBySymbol(underlyingAsset.symbol);
    underlyingAssetId = underlyingAssetResult.data[0].id;

    // underlyingAssetId = await adminSession.query('asset_id', { name: underlyingAsset.name });

    // 5. Set interest rate strategy
    const interestRateParams = {
      optimalUsageRatio: 800000000000000000000000000, // 0.8 in RAY
      baseVariableBorrowRate: 50000000000000000000000000, // 0.05 in RAY
      variableRateSlope1: 40000000000000000000000000, // 0.04 in RAY
      variableRateSlope2: 600000000000000000000000000, // 0.6 in RAY
    };

    await adminSession.call(
      op(
        'set_default_reserve_interest_rate_strategy',
        underlyingAssetId,
        interestRateParams.optimalUsageRatio,
        interestRateParams.baseVariableBorrowRate,
        interestRateParams.variableRateSlope1,
        interestRateParams.variableRateSlope2
      )
    );

    // 6. Configure reserve with a-asset
    const aAsset = {
      name: 'Test A Token',
      symbol: 'TAT',
      decimals: 6,
    };

    await adminSession.call(
      op('init_reserve_op', underlyingAssetId, adminAccountId, aAsset.name, aAsset.symbol, '', '')
    );

    const aAssetResult = await adminSession.getAssetsBySymbol(aAsset.symbol);
    aAssetId = aAssetResult.data[0].id;
  });

  describe('Basic Supply', () => {
    const supplyAmount = 50 * 10 ** 27; // 50 RAY
    const mintAmount = 100 * 10 ** 27; // 100 RAY

    beforeEach(async () => {
      // Mint underlying tokens to user A
      await adminSession.call(
        op('mint_underlying_asset', userAAccountId, mintAmount, underlyingAssetId)
      );
    });

    it('should supply underlying asset and receive a-asset', async () => {
      // Get initial balances
      const initialUnderlyingBalance = await adminSession.query('balance_of', {
        account_id: userAAccountId,
        asset_id: underlyingAssetId,
      });

      // Get holding account ID
      const holdingAccountId = await adminSession.query('get_a_asset_holding_account_id', {
        a_asset_id: aAssetId,
      });

      // Supply operation
      const result = await userASession.call(
        op(
          'supply',
          userAAccountId,
          underlyingAssetId,
          supplyAmount,
          userAAccountId,
          0 // referral code
        )
      );
      expect(result.receipt.statusCode).toBe(200);

      // Check balances after supply
      const finalUnderlyingBalance = await adminSession.query('balance_of', {
        account_id: userAAccountId,
        asset_id: underlyingAssetId,
      });

      const finalAAssetBalance = await adminSession.query('balance_of', {
        account_id: userAAccountId,
        asset_id: aAssetId,
      });

      const holdingAccountBalance = await adminSession.query('balance_of', {
        account_id: holdingAccountId,
        asset_id: underlyingAssetId,
      });

      // Verify balances
      expect(Number(finalUnderlyingBalance)).toBe(Number(initialUnderlyingBalance) - supplyAmount);
      expect(Number(holdingAccountBalance)).toBe(supplyAmount);

      // For initial supply, liquidity index is RAY (10^27), so scaled amount equals original amount
      const expectedATokens = supplyAmount;
      expect(Number(finalAAssetBalance)).toBeCloseTo(expectedATokens, -10); // Allow small rounding difference
    });

    it('should supply on behalf of another user', async () => {
      // Supply on behalf of user B
      const result = await userASession.call(
        op(
          'supply',
          userAAccountId,
          underlyingAssetId,
          supplyAmount,
          userBAccountId, // user B receives a-assets
          0 // referral code
        )
      );
      expect(result.receipt.statusCode).toBe(200);

      // Check user A's underlying token balance decreased
      const userAUnderlyingBalance =
        await adminSession.account.getBalanceByAssetId(underlyingAssetId);
      expect(Number(userAUnderlyingBalance)).toBe(mintAmount - supplyAmount);

      // Check user A did not receive a-assets
      const userAAAssetBalance = await adminSession.account.getBalanceByAssetId(aAssetId);
      expect(Number(userAAAssetBalance.amount.value)).toBe(0);

      // Check user B received a-assets
      const userBAAssetBalance = await adminSession.account.getBalanceByAssetId(aAssetId);

      // For initial supply, liquidity index is RAY (10^27), so scaled amount equals original amount
      const expectedATokens = supplyAmount;
      expect(Number(userBAAssetBalance.amount.value)).toBeCloseTo(expectedATokens, -10);
    });
  });

  describe('Supply Edge Cases', () => {
    it('should fail to supply with insufficient funds', async () => {
      // Mint small amount to user A
      const smallMintAmount = 10 * 10 ** 27; // 10 RAY
      await adminSession.call(
        op('mint_underlying_asset', userAAccountId, smallMintAmount, underlyingAssetId)
      );

      // Try to supply more than available
      const largeSupplyAmount = 100 * 10 ** 27; // 100 RAY

      try {
        await userASession.call(
          op('supply', userAAccountId, underlyingAssetId, largeSupplyAmount, userAAccountId, 0)
        );
        fail('Should have thrown an error for insufficient funds');
      } catch (error) {
        expect(error).toBeDefined();
      }

      // Verify balances unchanged
      const underlyingBalance = await adminSession.account.getBalanceByAssetId(underlyingAssetId);
      expect(Number(underlyingBalance.amount.value)).toBe(smallMintAmount);

      const aAssetBalance = await adminSession.account.getBalanceByAssetId(aAssetId);
      expect(Number(aAssetBalance.amount.value)).toBe(0);
    });

    it('should fail to supply zero amount', async () => {
      // Mint some tokens first
      const mintAmount = 100 * 10 ** 27; // 100 RAY
      await adminSession.call(
        op('mint_underlying_asset', userAAccountId, mintAmount, underlyingAssetId)
      );

      // Try to supply zero
      try {
        await userASession.call(
          op(
            'supply',
            userAAccountId,
            underlyingAssetId,
            0, // zero supply amount
            userAAccountId,
            0
          )
        );
        fail('Should have thrown an error for zero supply amount');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('Multiple Users Supply', () => {
    it('should handle multiple users supplying', async () => {
      // Mint tokens to both users
      const mintAmountA = 100 * 10 ** 27; // 100 RAY
      const mintAmountB = 200 * 10 ** 27; // 200 RAY

      await adminSession.call(
        op('mint_underlying_asset', userAAccountId, mintAmountA, underlyingAssetId)
      );

      await adminSession.call(
        op('mint_underlying_asset', userBAccountId, mintAmountB, underlyingAssetId)
      );

      // User A supplies
      const supplyAmountA = 50 * 10 ** 27; // 50 RAY
      await userASession.call(
        op('supply', userAAccountId, underlyingAssetId, supplyAmountA, userAAccountId, 0)
      );

      // User B supplies
      const supplyAmountB = 100 * 10 ** 27; // 100 RAY
      await userBSession.call(
        op('supply', userBAccountId, underlyingAssetId, supplyAmountB, userBAccountId, 0)
      );

      // Verify balances
      // 1. Underlying token balances
      const underlyingBalanceA = await adminSession.account.getBalanceByAssetId(underlyingAssetId);
      expect(Number(underlyingBalanceA.amount.value)).toBe(mintAmountA - supplyAmountA);

      const underlyingBalanceB = await adminSession.account.getBalanceByAssetId(underlyingAssetId);
      expect(Number(underlyingBalanceB.amount.value)).toBe(mintAmountB - supplyAmountB);

      // 2. A-asset balances
      const aAssetBalanceA = await adminSession.account.getBalanceByAssetId(aAssetId);
      expect(Number(aAssetBalanceA.amount.value)).toBeCloseTo(supplyAmountA, -10);

      const aAssetBalanceB = await adminSession.account.getBalanceByAssetId(aAssetId);
      expect(Number(aAssetBalanceB.amount.value)).toBeCloseTo(supplyAmountB, -10);
    });
  });
});
