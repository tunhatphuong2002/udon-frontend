import { op, Session } from '@chromia/ft4';
import { IClient } from 'postchain-client';
import { admin_kp, user_a_kp, user_b_kp } from '../../../configs/key-pair';
import { getClient } from '../../../clients';
import { registerAccountOpen } from '../../../common/operations/accounts';

interface Balance {
  asset_id: string;
  amount: string;
}

interface Asset {
  id: string;
  name: string;
  symbol: string;
  decimals: number;
}

interface AssetData {
  a_asset_holding_account_id: string;
  underlying_asset_id: string;
}

describe('A-Asset Factory Tests - Chromia FT4', () => {
  let adminSession: Session;
  let userASession: Session;
  let userBSession: Session;
  let client: IClient;

  beforeAll(async () => {
    client = await getClient();
    adminSession = await registerAccountOpen(client, admin_kp);
    userASession = await registerAccountOpen(client, user_a_kp);
    userBSession = await registerAccountOpen(client, user_b_kp);

    // Initialize ACL and grant POOL_ADMIN_ROLE to admin
    await adminSession.call(op('initialize', admin_kp.pubKey.toString('hex')));
    await adminSession.call(
      op('grant_role', 'POOL_ADMIN_ROLE', adminSession.account.id, admin_kp.pubKey.toString('hex'))
    );
  });

  // Initialize asset base used by multiple tests
  async function setupAssetBase() {
    await adminSession.call(op('initialize_asset_base'));
    await adminSession.call(op('initialize_underlying_asset_factory'));
    await adminSession.call(op('initialize_a_asset_factory'));
  }

  // Create underlying asset used by multiple tests
  async function createUnderlyingAsset() {
    const underlyingName = 'Test Underlying Token';
    const underlyingSymbol = 'TUT';
    const underlyingDecimals = 6;
    const underlyingIcon = 'http://example.com/icon.png';

    await adminSession.call(
      op(
        'create_underlying_asset',
        underlyingName,
        underlyingSymbol,
        underlyingDecimals,
        underlyingIcon
      )
    );

    const result = await adminSession.query('get_assets_by_symbol', {
      symbol: underlyingSymbol,
    });

    const underlyingAssets = result as unknown as Asset[];
    expect(Array.isArray(underlyingAssets) && underlyingAssets.length > 0).toBe(true);
    return underlyingAssets[0].id;
  }

  // Create a-asset used by multiple tests
  async function createAAsset(underlyingAssetId: string) {
    const aName = 'Test A Token';
    const aSymbol = 'TAT';
    const aDecimals = 6;
    const treasuryId = adminSession.account.id;

    await adminSession.call(
      op(
        'create_a_asset',
        admin_kp.pubKey.toString('hex'),
        aName,
        aSymbol,
        aDecimals,
        underlyingAssetId,
        treasuryId
      )
    );

    const result = await adminSession.query('get_assets_by_symbol', {
      symbol: aSymbol,
    });

    const aAssets = result as unknown as Asset[];
    expect(Array.isArray(aAssets) && aAssets.length > 0).toBe(true);
    return aAssets[0].id;
  }

  // Helper to get account balance
  async function getAccountBalance(accountId: string, assetId: string): Promise<string> {
    const result = await adminSession.query('get_balances', {
      account_id: accountId,
    });

    const balances = result as unknown as Balance[];
    return balances.find(b => b.asset_id === assetId)?.amount || '0';
  }

  it('should initialize a-asset factory only once and only by admin', async () => {
    // Ensure not initialized
    let isInitialized = await adminSession.query('is_a_asset_factory_initialized');
    expect(!!isInitialized).toBe(false);

    // Initialize by admin
    const result = await adminSession.call(op('initialize_a_asset_factory'));
    expect(result.receipt.statusCode).toBe(200);

    isInitialized = await adminSession.query('is_a_asset_factory_initialized');
    expect(!!isInitialized).toBe(true);

    // Try to initialize again (should fail)
    await expect(adminSession.call(op('initialize_a_asset_factory'))).rejects.toThrow();

    // Try to initialize with non-admin (userA)
    await expect(userASession.call(op('initialize_a_asset_factory'))).rejects.toThrow();
  });

  it('should create and query underlying asset and a-asset', async () => {
    // Initialize underlying asset factory
    await adminSession.call(op('initialize_underlying_asset_factory'));

    // Create underlying asset
    const underlyingName = 'Test Underlying Token';
    const underlyingSymbol = 'TUT';
    const underlyingDecimals = 6;
    const underlyingIcon = 'http://example.com/icon.png';

    await adminSession.call(
      op(
        'create_underlying_asset',
        underlyingName,
        underlyingSymbol,
        underlyingDecimals,
        underlyingIcon
      )
    );

    // Query underlying_asset_id
    const result = await adminSession.query('get_assets_by_symbol', {
      symbol: underlyingSymbol,
    });

    const underlyingAssets = result as unknown as Asset[];
    expect(Array.isArray(underlyingAssets) && underlyingAssets.length > 0).toBe(true);
    const underlyingAssetId = underlyingAssets[0]?.id;

    // Initialize a-asset factory
    await adminSession.call(op('initialize_a_asset_factory'));

    // Create a-asset
    const aName = 'Test A Token';
    const aSymbol = 'TAT';
    const aDecimals = 6;
    const treasuryId = adminSession.account.id;

    await adminSession.call(
      op(
        'create_a_asset',
        admin_kp.pubKey.toString('hex'),
        aName,
        aSymbol,
        aDecimals,
        underlyingAssetId,
        treasuryId
      )
    );

    // Query a-asset existence
    const aAssetResult = await adminSession.query('get_assets_by_symbol', {
      symbol: aSymbol,
    });

    const aAssets = aAssetResult as unknown as Asset[];
    expect(Array.isArray(aAssets) && aAssets.length > 0).toBe(true);
    expect(aAssets[0].name).toBe(aName);
    expect(aAssets[0].symbol).toBe(aSymbol);
    expect(aAssets[0].decimals).toBe(aDecimals);

    // Try to create a-asset again with same parameters (should fail)
    await expect(
      adminSession.call(
        op(
          'create_a_asset',
          admin_kp.pubKey.toString('hex'),
          aName,
          aSymbol,
          aDecimals,
          underlyingAssetId,
          treasuryId
        )
      )
    ).rejects.toThrow();

    // Try to create a-asset with different name but same underlying asset (should fail)
    const aName2 = 'Test A Token 2';
    const aSymbol2 = 'TAT2';

    await expect(
      adminSession.call(
        op(
          'create_a_asset',
          admin_kp.pubKey.toString('hex'),
          aName2,
          aSymbol2,
          aDecimals,
          underlyingAssetId,
          treasuryId
        )
      )
    ).rejects.toThrow();
  });

  it('should mint, burn, transfer, and check balances for a-asset', async () => {
    // Setup base modules
    await setupAssetBase();

    // Create assets
    const underlyingAssetId = await createUnderlyingAsset();
    const aAssetId = await createAAsset(underlyingAssetId);

    // Get holding account
    const holdingAccount = (await adminSession.query('get_a_asset_holding_account', {
      a_asset_id: aAssetId,
    })) as { id: string } | null;

    expect(holdingAccount && typeof holdingAccount.id === 'string').toBe(true);
    const holdingAccountId = holdingAccount!.id;

    // Mint underlying asset to holding account
    const initialUnderlyingAmount = 500_000_000; // 500 * 10^6
    await adminSession.call(
      op('mint_underlying_asset', holdingAccountId, initialUnderlyingAmount, underlyingAssetId)
    );

    // Mint a-asset to userA
    const mintAmount = 100_000_000; // 100 * 10^6
    const currentIndex = 1_250_000_000_000_000_000_000_000_000; // 1.25 * RAY

    await adminSession.call(
      op(
        'mint_a_asset',
        adminSession.account.id,
        userASession.account.id,
        aAssetId,
        mintAmount,
        currentIndex
      )
    );

    // Check userA a-asset balance
    const userABalanceBefore = await getAccountBalance(
      userASession.account.id.toString('hex'),
      aAssetId
    );
    expect(Number(userABalanceBefore)).toBeGreaterThan(0);

    // Try to mint a-asset by userA (should fail)
    await expect(
      userASession.call(
        op(
          'mint_a_asset',
          userASession.account.id,
          userASession.account.id,
          aAssetId,
          mintAmount,
          currentIndex
        )
      )
    ).rejects.toThrow();

    // Burn a-asset
    const burnAmount = 50_000_000; // 50 * 10^6

    await adminSession.call(
      op(
        'burn_a_asset',
        userASession.account.id,
        userASession.account.id,
        aAssetId,
        burnAmount,
        currentIndex
      )
    );

    // Check userA a-asset balance after burn
    const userABalanceAfterBurn = await getAccountBalance(
      userASession.account.id.toString('hex'),
      aAssetId
    );
    expect(Number(userABalanceAfterBurn)).toBeLessThan(Number(userABalanceBefore));

    // Check userA underlying asset received
    const userAUnderlyingBalance = await getAccountBalance(
      userASession.account.id.toString('hex'),
      underlyingAssetId
    );
    expect(Number(userAUnderlyingBalance)).toBeGreaterThan(0);

    // Check holding account underlying balance was reduced
    const holdingUnderlyingBalance = await getAccountBalance(holdingAccountId, underlyingAssetId);
    expect(Number(holdingUnderlyingBalance)).toBeLessThan(initialUnderlyingAmount);

    // Transfer a-asset from userA to userB
    const transferAmount = 10_000_000; // 10 * 10^6

    await userASession.call(
      op(
        'transfer_a_asset_on_liquidation',
        userASession.account.id,
        userBSession.account.id,
        aAssetId,
        transferAmount,
        currentIndex
      )
    );

    // Check userB received a-asset
    const userBAAssetBalance = await getAccountBalance(
      userBSession.account.id.toString('hex'),
      aAssetId
    );
    expect(Number(userBAAssetBalance)).toBeGreaterThan(0);

    // Check userA balance was reduced
    const userABalanceAfterTransfer = await getAccountBalance(
      userASession.account.id.toString('hex'),
      aAssetId
    );
    expect(Number(userABalanceAfterTransfer)).toBeLessThan(Number(userABalanceAfterBurn));
  });

  it('should mint a-assets to treasury', async () => {
    // Setup base modules
    await setupAssetBase();

    // Create assets
    const underlyingAssetId = await createUnderlyingAsset();
    const aAssetId = await createAAsset(underlyingAssetId);

    // Mint a-asset to user
    const mintAmount = 100_000_000; // 100 * 10^6
    const currentIndex = 1_250_000_000_000_000_000_000_000_000; // 1.25 * RAY

    await adminSession.call(
      op(
        'mint_a_asset',
        adminSession.account.id,
        userASession.account.id,
        aAssetId,
        mintAmount,
        currentIndex
      )
    );

    // Mint a-asset to treasury
    await adminSession.call(op('mint_a_asset_to_treasury', mintAmount, aAssetId, currentIndex));

    // Check treasury balance
    const treasuryId = adminSession.account.id.toString('hex'); // Treasury is admin account
    const treasuryBalance = await getAccountBalance(treasuryId, aAssetId);

    expect(Number(treasuryBalance)).toBeGreaterThan(0);
  });

  it('should transfer underlying asset to target account', async () => {
    // Setup base modules
    await setupAssetBase();

    // Create assets
    const underlyingAssetId = await createUnderlyingAsset();
    const aAssetId = await createAAsset(underlyingAssetId);

    // Get holding account
    const holdingAccount = (await adminSession.query('get_a_asset_holding_account', {
      a_asset_id: aAssetId,
    })) as { id: string } | null;

    expect(holdingAccount && typeof holdingAccount.id === 'string').toBe(true);
    const holdingAccountId = holdingAccount!.id;

    // Mint underlying asset to holding account
    const underlyingAmount = 100_000_000; // 100 * 10^6

    await adminSession.call(
      op('mint_underlying_asset', holdingAccountId, underlyingAmount, underlyingAssetId)
    );

    // Check holding account balance
    const holdingInitialBalance = await getAccountBalance(holdingAccountId, underlyingAssetId);
    expect(Number(holdingInitialBalance)).toBe(underlyingAmount);

    // Transfer underlying to user A
    await adminSession.call(
      op('transfer_underlying_to', userASession.account.id, aAssetId, underlyingAmount)
    );

    // Check user A received underlying tokens
    const userABalance = await getAccountBalance(
      userASession.account.id.toString('hex'),
      underlyingAssetId
    );
    expect(Number(userABalance)).toBe(underlyingAmount);

    // Check holding account balance - should be 0 now
    const holdingFinalBalance = await getAccountBalance(holdingAccountId, underlyingAssetId);
    expect(Number(holdingFinalBalance)).toBe(0);
  });

  it('should verify a-asset holding account creation', async () => {
    // Initialize underlying asset factory
    await adminSession.call(op('initialize_underlying_asset_factory'));

    // Create underlying asset
    const underlyingAssetId = await createUnderlyingAsset();

    // Initialize a-asset factory
    await adminSession.call(op('initialize_a_asset_factory'));

    // Create a-asset
    const aAssetId = await createAAsset(underlyingAssetId);

    // Get the holding account
    const holdingAccount = (await adminSession.query('get_a_asset_holding_account', {
      a_asset_id: aAssetId,
    })) as { id: string } | null;

    expect(holdingAccount).not.toBeNull();
    expect(typeof holdingAccount!.id).toBe('string');

    // Get a-asset data to check if the holding account is correctly linked
    const aAssetData = await adminSession.query('get_a_asset_data', {
      a_asset_id: aAssetId,
    });

    expect(aAssetData).not.toBeNull();
    const typedAssetData = aAssetData as unknown as AssetData;
    expect(typedAssetData.a_asset_holding_account_id).toBe(holdingAccount!.id);
    expect(typedAssetData.underlying_asset_id).toBe(underlyingAssetId);
  });

  it('should allow transfers to holding account', async () => {
    // Setup base modules
    await setupAssetBase();

    // Create assets
    const underlyingAssetId = await createUnderlyingAsset();
    const aAssetId = await createAAsset(underlyingAssetId);

    // Get holding account
    const holdingAccount = (await adminSession.query('get_a_asset_holding_account', {
      a_asset_id: aAssetId,
    })) as { id: string } | null;

    expect(holdingAccount).not.toBeNull();
    const holdingAccountId = holdingAccount!.id;

    // Mint underlying asset to admin
    const underlyingAmount = 1000_000_000; // 1000 * 10^6

    await adminSession.call(
      op('mint_underlying_asset', adminSession.account.id, underlyingAmount, underlyingAssetId)
    );

    // Check admin balance of underlying asset
    const adminUnderlyingBalanceBefore = await getAccountBalance(
      adminSession.account.id.toString('hex'),
      underlyingAssetId
    );
    expect(Number(adminUnderlyingBalanceBefore)).toBe(underlyingAmount);

    // Transfer underlying asset to holding account
    const transferAmount = 500_000_000; // 500 * 10^6

    await adminSession.call(
      op(
        'transfer_underlying_asset',
        adminSession.account.id,
        holdingAccountId,
        transferAmount,
        underlyingAssetId
      )
    );

    // Check holding account received the underlying asset
    const holdingUnderlyingBalance = await getAccountBalance(holdingAccountId, underlyingAssetId);
    expect(Number(holdingUnderlyingBalance)).toBe(transferAmount);

    // Mint a-asset directly to holding account
    const aAssetAmount = 200_000_000; // 200 * 10^6
    const currentIndex = 1_000_000_000_000_000_000_000_000_000; // 1.0 * RAY (no interest accrued)

    await adminSession.call(
      op(
        'mint_a_asset',
        adminSession.account.id,
        holdingAccountId,
        aAssetId,
        aAssetAmount,
        currentIndex
      )
    );

    // Check holding account balance of a-asset
    const holdingAAssetBalance = await getAccountBalance(holdingAccountId, aAssetId);
    expect(Number(holdingAAssetBalance)).toBe(aAssetAmount);
  });

  it('should restrict direct transfers from holding account', async () => {
    // Setup base modules
    await setupAssetBase();

    // Create assets
    const underlyingAssetId = await createUnderlyingAsset();
    const aAssetId = await createAAsset(underlyingAssetId);

    // Get holding account
    const holdingAccount = (await adminSession.query('get_a_asset_holding_account', {
      a_asset_id: aAssetId,
    })) as { id: string } | null;

    expect(holdingAccount).not.toBeNull();
    const holdingAccountId = holdingAccount!.id;

    // Set up initial balances - mint underlying tokens to holding account
    const underlyingAmount = 1000_000_000; // 1000 * 10^6

    await adminSession.call(
      op('mint_underlying_asset', holdingAccountId, underlyingAmount, underlyingAssetId)
    );

    // Mint a-tokens to holding account
    const aAssetAmount = 500_000_000; // 500 * 10^6
    const currentIndex = 1_000_000_000_000_000_000_000_000_000; // 1.0 * RAY

    await adminSession.call(
      op(
        'mint_a_asset',
        adminSession.account.id,
        holdingAccountId,
        aAssetId,
        aAssetAmount,
        currentIndex
      )
    );

    // Try to directly transfer FROM holding account (should fail)
    await expect(
      adminSession.call(
        op(
          'transfer_underlying_asset',
          holdingAccountId,
          userASession.account.id,
          100_000_000, // 100 * 10^6
          underlyingAssetId
        )
      )
    ).rejects.toThrow();

    // Use contract function to transfer FROM holding account
    const transferAmount = 200_000_000; // 200 * 10^6

    await adminSession.call(
      op('transfer_underlying_to', userASession.account.id, aAssetId, transferAmount)
    );

    // Verify the transfer worked through contract logic
    const userAUnderlyingBalance = await getAccountBalance(
      userASession.account.id.toString('hex'),
      underlyingAssetId
    );
    expect(Number(userAUnderlyingBalance)).toBe(transferAmount);

    // Verify holding account balance was reduced
    const holdingUnderlyingBalanceAfter = await getAccountBalance(
      holdingAccountId,
      underlyingAssetId
    );
    expect(Number(holdingUnderlyingBalanceAfter)).toBe(underlyingAmount - transferAmount);
  });
});
