import { op, Session } from '@chromia/ft4';
import { IClient } from 'postchain-client';
import { admin_kp, user_a_kp } from '@configs/key-pair';
import { registerAccountOpen } from '@common/operations/accounts';
import { getClient } from '@/clients';

describe('Variable Debt Asset Factory', () => {
  let adminSession: Session;
  let userASession: Session;
  //   let userBSession: Session;
  let client: IClient;
  let adminAccountId: string;
  let userAAccountId: string;
  //   let userBAccountId: string;
  let underlyingAssetId: string;

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

    // const userBAccounts = await adminSession.query('get_accounts_by_signer', {
    //   signer: user_b_kp.pubKey,
    //   limit: 1,
    //   offset: null,
    // });
    // userBAccountId = userBAccounts[0].id;

    // Initialize ACL module
    await adminSession.call(op('initialize', admin_kp.pubKey));
    await adminSession.call(op('grant_role', 'POOL_ADMIN', adminAccountId, admin_kp.pubKey));
    await adminSession.call(
      op('grant_role', 'ASSET_LISTING_ADMIN', adminAccountId, admin_kp.pubKey)
    );

    // Initialize asset base
    await adminSession.call(op('initialize_asset_base'));

    // Initialize underlying asset factory and create a test underlying asset
    await adminSession.call(op('initialize_underlying_asset_factory'));

    // Create test underlying asset
    const underlyingAsset = {
      name: 'Test Underlying',
      symbol: 'TU',
      decimals: 8,
      icon: '',
    };

    await adminSession.call(
      op(
        'create_underlying_asset',
        underlyingAsset.name,
        underlyingAsset.symbol,
        underlyingAsset.decimals,
        underlyingAsset.icon
      )
    );

    underlyingAssetId = await adminSession.query('asset_id', { name: underlyingAsset.name });
  });

  describe('Initialization', () => {
    it('should initialize variable debt asset factory with admin', async () => {
      const result = await adminSession.call(op('initialize_variable_debt_asset_factory'));
      expect(result.receipt.statusCode).toBe(200);

      const isInitialized = await adminSession.query('is_variable_debt_asset_factory_initialized');
      expect(!!isInitialized).toBe(true);
    });

    it('should fail to initialize again', async () => {
      try {
        await adminSession.call(op('initialize_variable_debt_asset_factory'));
        fail('Should have thrown an error on second initialization');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should fail to initialize with non-admin user', async () => {
      try {
        await userASession.call(op('initialize_variable_debt_asset_factory'));
        fail('Should have thrown an error for unauthorized user');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should return the correct revision number', async () => {
      const revision = await adminSession.query('get_variable_debt_asset_factory_revision');
      expect(revision).toBeGreaterThan(0); // Assuming there's always a positive revision number
    });
  });

  describe('Asset Creation and Query', () => {
    const variableDebtAsset = {
      name: 'Test Variable Debt',
      symbol: 'vTU',
      decimals: 8,
    };
    let variableDebtAssetId: string;

    it('should create a variable debt asset', async () => {
      const result = await adminSession.call(
        op(
          'create_variable_debt_asset',
          variableDebtAsset.name,
          variableDebtAsset.symbol,
          variableDebtAsset.decimals,
          underlyingAssetId
        )
      );
      expect(result.receipt.statusCode).toBe(200);

      variableDebtAssetId = await adminSession.query('asset_id', { name: variableDebtAsset.name });
      expect(variableDebtAssetId).toBeDefined();
    });

    it('should store the correct underlying asset relationship', async () => {
      const retrievedUnderlyingId = await adminSession.query(
        'get_underlying_asset_id_of_variable_debt',
        {
          variable_debt_asset_id: variableDebtAssetId,
        }
      );
      expect(retrievedUnderlyingId).toBe(underlyingAssetId);
    });

    it('should fail to create with non-existent underlying asset', async () => {
      const nonExistentId = '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

      try {
        await adminSession.call(
          op('create_variable_debt_asset', 'Invalid Asset', 'INVALID', 8, nonExistentId)
        );
        fail('Should have thrown an error for non-existent underlying asset');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should fail to create duplicate name or symbol', async () => {
      try {
        await adminSession.call(
          op(
            'create_variable_debt_asset',
            variableDebtAsset.name, // Same name
            'DIFF',
            variableDebtAsset.decimals,
            underlyingAssetId
          )
        );
        fail('Should have thrown an error for duplicate name');
      } catch (error) {
        expect(error).toBeDefined();
      }

      try {
        await adminSession.call(
          op(
            'create_variable_debt_asset',
            'Different Name',
            variableDebtAsset.symbol, // Same symbol
            variableDebtAsset.decimals,
            underlyingAssetId
          )
        );
        fail('Should have thrown an error for duplicate symbol');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('Mint and Burn Operations', () => {
    const debtToken = {
      name: 'Debt Token',
      symbol: 'vDEBT',
      decimals: 8,
    };
    let debtTokenId: string;
    const mintAmount = 200 * 10 ** 27; // 200 * RAY
    const currentIndex = 1.25 * 10 ** 27; // 1.25 * RAY
    const burnAmount = 100 * 10 ** 27; // 100 * RAY

    beforeAll(async () => {
      // Create variable debt asset for testing
      await adminSession.call(
        op(
          'create_variable_debt_asset',
          debtToken.name,
          debtToken.symbol,
          debtToken.decimals,
          underlyingAssetId
        )
      );
      debtTokenId = await adminSession.query('asset_id', { name: debtToken.name });
    });

    it('should mint variable debt tokens', async () => {
      const result = await adminSession.call(
        op(
          'mint_variable_debt_asset',
          adminAccountId,
          userAAccountId,
          debtTokenId,
          mintAmount,
          currentIndex
        )
      );
      expect(result.receipt.statusCode).toBe(200);

      const balance = await adminSession.query('balance_of', {
        account_id: userAAccountId,
        asset_id: debtTokenId,
      });

      // Expected balance is scaled by the index
      const expectedScaledAmount = Math.floor(mintAmount / currentIndex);
      expect(Number(balance)).toBeCloseTo(expectedScaledAmount, -10); // Allow some margin for rounding
    });

    it('should burn variable debt tokens', async () => {
      const initialBalance = await adminSession.query('balance_of', {
        account_id: userAAccountId,
        asset_id: debtTokenId,
      });

      const result = await adminSession.call(
        op('burn_variable_debt_asset', userAAccountId, debtTokenId, burnAmount, currentIndex)
      );
      expect(result.receipt.statusCode).toBe(200);

      const finalBalance = await adminSession.query('balance_of', {
        account_id: userAAccountId,
        asset_id: debtTokenId,
      });

      // Calculate expected remaining balance
      const burnAmountScaled = Math.floor(burnAmount / currentIndex);
      const expectedRemaining = Number(initialBalance) - burnAmountScaled;
      expect(Number(finalBalance)).toBeCloseTo(expectedRemaining, -10);
    });

    it('should fail when non-admin tries to mint tokens', async () => {
      try {
        await userASession.call(
          op(
            'mint_variable_debt_asset',
            userAAccountId,
            userAAccountId,
            debtTokenId,
            mintAmount,
            currentIndex
          )
        );
        fail('Should have thrown an error for unauthorized mint');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('Data Management', () => {
    const dataTestAsset = {
      name: 'Droppable Debt',
      symbol: 'vDROP',
      decimals: 8,
    };
    let dataTestAssetId: string;

    beforeAll(async () => {
      // Create variable debt asset for testing
      await adminSession.call(
        op(
          'create_variable_debt_asset',
          dataTestAsset.name,
          dataTestAsset.symbol,
          dataTestAsset.decimals,
          underlyingAssetId
        )
      );
      dataTestAssetId = await adminSession.query('asset_id', { name: dataTestAsset.name });
    });

    it('should have variable debt asset data', async () => {
      const data = (await adminSession.query('get_variable_debt_asset_data', {
        variable_debt_asset_id: dataTestAssetId,
      })) as {
        variable_debt_asset_id: string;
        underlying_asset_id: string;
      };

      expect(data).toBeDefined();
      expect(data.variable_debt_asset_id).toBe(dataTestAssetId);
      expect(data.underlying_asset_id).toBe(underlyingAssetId);
    });

    it('should drop variable debt asset data', async () => {
      const result = await adminSession.call(
        op('drop_variable_debt_asset_data_op', dataTestAssetId)
      );
      expect(result.receipt.statusCode).toBe(200);

      // Data should be gone but asset should still exist
      const data = await adminSession.query('get_variable_debt_asset_data', {
        variable_debt_asset_id: dataTestAssetId,
      });
      expect(data).toBeNull();

      // Check asset still exists (can query its name)
      const assetName = await adminSession.query('asset_name', { asset_id: dataTestAssetId });
      expect(assetName).toBe(dataTestAsset.name);
    });

    it('should fail when non-admin tries to drop data', async () => {
      // Create another asset for this test
      await adminSession.call(
        op('create_variable_debt_asset', 'Permission Test', 'vPERM', 8, underlyingAssetId)
      );
      const permTestAssetId = await adminSession.query('asset_id', { name: 'Permission Test' });

      try {
        await userASession.call(op('drop_variable_debt_asset_data_op', permTestAssetId));
        fail('Should have thrown an error for unauthorized drop');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
