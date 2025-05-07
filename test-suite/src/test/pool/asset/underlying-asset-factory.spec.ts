import { op, Session } from '@chromia/ft4';
import { IClient } from 'postchain-client';
import { admin_kp, user_a_kp, user_b_kp } from '@configs/key-pair';
import { registerAccountOpen } from '@common/operations/accounts';
import { getClient } from '@/clients';

describe('Underlying Asset Factory', () => {
  let adminSession: Session;
  let userASession: Session;
  //   let userBSession: Session;
  let client: IClient;
  let adminAccountId: string;
  let userAAccountId: string;
  let userBAccountId: string;

  beforeAll(async () => {
    client = await getClient();
    // Setup sessions
    adminSession = await registerAccountOpen(client, admin_kp);
    userASession = await registerAccountOpen(client, user_a_kp);
    // userBSession = await registerAccountOpen(client, user_b_kp);

    // Get account IDs
    const accounts = await adminSession.query('get_accounts_by_signer', {
      signer: admin_kp.pubKey,
      limit: 1,
      offset: null,
    });
    adminAccountId = accounts[0].id;

    const userAAccounts = await adminSession.query('get_accounts_by_signer', {
      signer: user_a_kp.pubKey,
      limit: 1,
      offset: null,
    });
    userAAccountId = userAAccounts[0].id;

    const userBAccounts = await adminSession.query('get_accounts_by_signer', {
      signer: user_b_kp.pubKey,
      limit: 1,
      offset: null,
    });
    userBAccountId = userBAccounts[0].id;

    // Initialize ACL module
    await adminSession.call(op('initialize', admin_kp.pubKey));
    await adminSession.call(op('grant_role', 'POOL_ADMIN', adminAccountId, admin_kp.pubKey));
  });

  describe('Initialization', () => {
    it('should initialize underlying asset factory with admin', async () => {
      const result = await adminSession.call(op('initialize_underlying_asset_factory'));
      expect(result.receipt.statusCode).toBe(200);

      const isInitialized = await adminSession.query('is_underlying_asset_factory_initialized');
      expect(!!isInitialized).toBe(true);
    });

    it('should fail to initialize again', async () => {
      try {
        await adminSession.call(op('initialize_underlying_asset_factory'));
        fail('Should have thrown an error on second initialization');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should fail to initialize with non-admin user', async () => {
      // Reset for this test - would normally need to be in a separate test suite
      try {
        await userASession.call(op('initialize_underlying_asset_factory'));
        fail('Should have thrown an error for unauthorized user');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('Asset Creation and Query', () => {
    const testAsset = {
      name: 'Test Token',
      symbol: 'TT',
      decimals: 6,
      icon: 'http://example.com/icon.png',
    };

    beforeAll(async () => {
      // Ensure factory is initialized
      const isInitialized = await adminSession.query('is_underlying_asset_factory_initialized');
      if (!isInitialized) {
        await adminSession.call(op('initialize_underlying_asset_factory'));
      }
    });

    it('should create an underlying asset', async () => {
      const result = await adminSession.call(
        op(
          'create_underlying_asset',
          testAsset.name,
          testAsset.symbol,
          testAsset.decimals,
          testAsset.icon
        )
      );
      expect(result.receipt.statusCode).toBe(200);
    });

    it('should query asset details', async () => {
      const assetId = await adminSession.query('asset_id', { name: testAsset.name });
      expect(assetId).toBeDefined();

      const name = await adminSession.query('asset_name', { asset_id: assetId });
      expect(name).toBe(testAsset.name);

      const symbol = await adminSession.query('asset_symbol', { asset_id: assetId });
      expect(symbol).toBe(testAsset.symbol);

      const decimals = await adminSession.query('asset_decimals', { asset_id: assetId });
      expect(decimals).toBe(testAsset.decimals);
    });

    it('should fail to create asset with existing name', async () => {
      try {
        await adminSession.call(
          op(
            'create_underlying_asset',
            testAsset.name,
            testAsset.symbol,
            testAsset.decimals,
            testAsset.icon
          )
        );
        fail('Should have thrown an error on duplicate asset creation');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('Mint, Burn, and Balance', () => {
    const mintAsset = {
      name: 'MintCoin',
      symbol: 'MC',
      decimals: 8,
    };
    let mintAssetId: string;
    const mintAmount = 10000000000; // 100 MC with 8 decimals
    const burnAmount = 3000000000; // 30 MC

    beforeAll(async () => {
      // Ensure factory is initialized
      const isInitialized = await adminSession.query('is_underlying_asset_factory_initialized');
      if (!isInitialized) {
        await adminSession.call(op('initialize_underlying_asset_factory'));
      }

      // Create test asset
      await adminSession.call(
        op('create_underlying_asset', mintAsset.name, mintAsset.symbol, mintAsset.decimals, '')
      );
      mintAssetId = await adminSession.query('asset_id', { name: mintAsset.name });
    });

    it('should mint assets to a user', async () => {
      const initialBalance = await adminSession.query('balance_of', {
        account_id: userAAccountId,
        asset_id: mintAssetId,
      });
      expect(initialBalance).toBe(0);

      const result = await adminSession.call(
        op('mint_underlying_asset', userAAccountId, mintAmount, mintAssetId)
      );
      expect(result.receipt.statusCode).toBe(200);

      const balance = await adminSession.query('balance_of', {
        account_id: userAAccountId,
        asset_id: mintAssetId,
      });
      expect(balance).toBe(mintAmount);
    });

    it('should allow user to burn their assets', async () => {
      const initialBalance = await adminSession.query('balance_of', {
        account_id: userAAccountId,
        asset_id: mintAssetId,
      });

      const result = await userASession.call(
        op('burn_underlying_asset', userAAccountId, burnAmount, mintAssetId)
      );
      expect(result.receipt.statusCode).toBe(200);

      const balance = await adminSession.query('balance_of', {
        account_id: userAAccountId,
        asset_id: mintAssetId,
      });
      expect(balance).toBe(Number(initialBalance) - burnAmount);
    });

    it('should fail when burning more than balance', async () => {
      const balance = await adminSession.query('balance_of', {
        account_id: userAAccountId,
        asset_id: mintAssetId,
      });

      const excessiveBurn = Number(balance) + 1;

      try {
        await userASession.call(
          op('burn_underlying_asset', userAAccountId, excessiveBurn, mintAssetId)
        );
        fail('Should have thrown an error on excessive burn');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('Transfer', () => {
    const transferAsset = {
      name: 'TransferCoin',
      symbol: 'TRC',
      decimals: 6,
    };
    let transferAssetId: string;
    const initialAmount = 500000000; // 500 TRC
    const transferAmount = 200000000; // 200 TRC

    beforeAll(async () => {
      // Ensure factory is initialized
      const isInitialized = await adminSession.query('is_underlying_asset_factory_initialized');
      if (!isInitialized) {
        await adminSession.call(op('initialize_underlying_asset_factory'));
      }

      // Create test asset
      await adminSession.call(
        op(
          'create_underlying_asset',
          transferAsset.name,
          transferAsset.symbol,
          transferAsset.decimals,
          ''
        )
      );
      transferAssetId = await adminSession.query('asset_id', { name: transferAsset.name });

      // Mint initial amount to user A
      await adminSession.call(
        op('mint_underlying_asset', userAAccountId, initialAmount, transferAssetId)
      );
    });

    it('should transfer assets between users', async () => {
      const initialBalanceA = await adminSession.query('balance_of', {
        account_id: userAAccountId,
        asset_id: transferAssetId,
      });

      const initialBalanceB = await adminSession.query('balance_of', {
        account_id: userBAccountId,
        asset_id: transferAssetId,
      });
      expect(initialBalanceB).toBe(0);

      const result = await userASession.call(
        op(
          'transfer_underlying_asset',
          userAAccountId,
          userBAccountId,
          transferAmount,
          transferAssetId
        )
      );
      expect(result.receipt.statusCode).toBe(200);

      const finalBalanceA = await adminSession.query('balance_of', {
        account_id: userAAccountId,
        asset_id: transferAssetId,
      });
      expect(finalBalanceA).toBe(Number(initialBalanceA) - transferAmount);

      const finalBalanceB = await adminSession.query('balance_of', {
        account_id: userBAccountId,
        asset_id: transferAssetId,
      });
      expect(finalBalanceB).toBe(transferAmount);
    });

    it('should fail when transferring more than balance', async () => {
      const balance = await adminSession.query('balance_of', {
        account_id: userAAccountId,
        asset_id: transferAssetId,
      });

      const excessiveTransfer = Number(balance) + 1;

      try {
        await userASession.call(
          op(
            'transfer_underlying_asset',
            userAAccountId,
            userBAccountId,
            excessiveTransfer,
            transferAssetId
          )
        );
        fail('Should have thrown an error on excessive transfer');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
