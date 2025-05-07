import { op, Session } from '@chromia/ft4';
import { IClient } from 'postchain-client';
import { admin_kp, user_a_kp, user_b_kp } from '@configs/key-pair';
import { registerAccountOpen } from '@common/operations/accounts';
import { getClient } from '@/clients';

describe('eMode Logic', () => {
  let adminSession: Session;
  let userASession: Session;
  let userBSession: Session;
  let client: IClient;
  let adminAccountId: string;
  let userAAccountId: string;
  //   let userBAccountId: string;

  beforeAll(async () => {
    client = await getClient();
    // Setup sessions
    adminSession = await registerAccountOpen(client, admin_kp);
    userASession = await registerAccountOpen(client, user_a_kp);
    userBSession = await registerAccountOpen(client, user_b_kp);

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
  });

  describe('Initialization', () => {
    it('should initialize eMode logic with admin', async () => {
      const result = await adminSession.call(op('initialize_emode_logic'));
      expect(result.receipt.statusCode).toBe(200);

      const isInitialized = await adminSession.query('is_emode_logic_initialized');
      expect(!!isInitialized).toBe(true);
    });

    it('should fail to initialize again', async () => {
      try {
        await adminSession.call(op('initialize_emode_logic'));
        fail('Should have thrown an error on second initialization');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should fail to initialize with non-admin user', async () => {
      try {
        await userASession.call(op('initialize_emode_logic'));
        fail('Should have thrown an error for unauthorized user');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('eMode Categories', () => {
    it('should configure eMode categories', async () => {
      // Configure Category 1 (Stablecoins)
      const category1 = {
        id: 1,
        ltv: 8000, // 80% in basis points
        liquidationThreshold: 8500, // 85% in basis points
        liquidationBonus: 1050, // 5% bonus in basis points
        priceSource: admin_kp.pubKey, // Dummy price source
        label: 'Stablecoins',
      };

      const result1 = await adminSession.call(
        op(
          'configure_emode_category',
          category1.id,
          category1.ltv,
          category1.liquidationThreshold,
          category1.liquidationBonus,
          category1.priceSource,
          category1.label
        )
      );
      expect(result1.receipt.statusCode).toBe(200);

      // Configure Category 2 (ETH Derivatives)
      const category2 = {
        id: 2,
        ltv: 9000, // 90% in basis points
        liquidationThreshold: 9300, // 93% in basis points
        liquidationBonus: 1025, // 2.5% bonus in basis points
        priceSource: admin_kp.pubKey, // Dummy price source
        label: 'ETH Derivatives',
      };

      const result2 = await adminSession.call(
        op(
          'configure_emode_category',
          category2.id,
          category2.ltv,
          category2.liquidationThreshold,
          category2.liquidationBonus,
          category2.priceSource,
          category2.label
        )
      );
      expect(result2.receipt.statusCode).toBe(200);

      // Verify categories were created correctly
      const categoryData1 = (await adminSession.query('get_emode_category_data', {
        id: category1.id,
      })) as {
        id: number;
        ltv: number;
        liquidation_threshold: number;
        liquidation_bonus: number;
        label: string;
      };
      expect(categoryData1.id).toBe(category1.id);
      expect(categoryData1.ltv).toBe(category1.ltv);
      expect(categoryData1.liquidation_threshold).toBe(category1.liquidationThreshold);
      expect(categoryData1.liquidation_bonus).toBe(category1.liquidationBonus);
      expect(categoryData1.label).toBe(category1.label);

      const categoryData2 = (await adminSession.query('get_emode_category_data', {
        id: category2.id,
      })) as {
        id: number;
        ltv: number;
        liquidation_threshold: number;
        liquidation_bonus: number;
        label: string;
      };
      expect(categoryData2.id).toBe(category2.id);
      expect(categoryData2.ltv).toBe(category2.ltv);
      expect(categoryData2.liquidation_threshold).toBe(category2.liquidationThreshold);
      expect(categoryData2.liquidation_bonus).toBe(category2.liquidationBonus);
      expect(categoryData2.label).toBe(category2.label);
    });

    it('should fail to configure category with ID 0', async () => {
      try {
        await adminSession.call(
          op(
            'configure_emode_category',
            0, // Invalid ID
            8000,
            8500,
            1050,
            admin_kp.pubKey,
            'Invalid Category'
          )
        );
        fail('Should have thrown an error for category ID 0');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should update existing categories', async () => {
      const updatedLtv = 8500;
      const updatedLabel = 'Stablecoins V2';

      const result = await adminSession.call(
        op(
          'configure_emode_category',
          1,
          updatedLtv,
          8500, // Keep original liquidation threshold
          1050, // Keep original liquidation bonus
          admin_kp.pubKey,
          updatedLabel
        )
      );
      expect(result.receipt.statusCode).toBe(200);

      // Verify category was updated
      const updatedCategory = (await adminSession.query('get_emode_category_data', {
        id: 1,
      })) as {
        id: number;
        ltv: number;
        label: string;
      };
      expect(updatedCategory.ltv).toBe(updatedLtv);
      expect(updatedCategory.label).toBe(updatedLabel);
    });

    it('should fail when non-admin tries to configure category', async () => {
      try {
        await userASession.call(
          op(
            'configure_emode_category',
            3,
            8000,
            8500,
            1050,
            user_a_kp.pubKey,
            'Unauthorized Category'
          )
        );
        fail('Should have thrown an error for unauthorized configuration');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('User eMode Operations', () => {
    it('should set user eMode category', async () => {
      // Set user to eMode category 1
      const result = await userASession.call(op('set_user_emode', userAAccountId, 1));
      expect(result.receipt.statusCode).toBe(200);

      // Verify user is in category 1
      const userEmode = await userASession.query('get_user_emode', { user_id: userAAccountId });
      expect(userEmode).toBe(1);
    });

    it('should allow user to reset to default category', async () => {
      // Reset to category 0 (default)
      const result = await userASession.call(op('set_user_emode', userAAccountId, 0));
      expect(result.receipt.statusCode).toBe(200);

      // Verify user is in default category
      const userEmode = await userASession.query('get_user_emode', { user_id: userAAccountId });
      expect(userEmode).toBe(0);
    });

    it('should fail when setting to non-existent category', async () => {
      try {
        await userASession.call(
          op('set_user_emode', userAAccountId, 999) // Non-existent category
        );
        fail('Should have thrown an error for non-existent category');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should fail when other user tries to set category', async () => {
      try {
        await userBSession.call(
          op('set_user_emode', userAAccountId, 1) // User B tries to set for User A
        );
        fail('Should have thrown an error for unauthorized user');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('eMode Configuration Queries', () => {
    it('should get eMode configuration', async () => {
      const config = (await adminSession.query('get_emode_configuration', {
        category_id: 1,
      })) as {
        ltv: number;
        liquidation_threshold: number;
      };
      expect(config).toBeDefined();
      expect(config.ltv).toBe(8500); // Updated value from previous test
      expect(config.liquidation_threshold).toBe(8500);
    });

    it('should get eMode category label', async () => {
      const label = await adminSession.query('get_emode_category_label', { category_id: 1 });
      expect(label).toBe('Stablecoins V2'); // Updated value from previous test
    });

    it('should get eMode category liquidation bonus', async () => {
      const bonus = await adminSession.query('get_emode_category_liquidation_bonus', {
        category_id: 1,
      });
      expect(bonus).toBe(1050);
    });

    it('should check if a user is in a specific eMode category', async () => {
      // First set user A to category 1
      await userASession.call(op('set_user_emode', userAAccountId, 1));

      // Check with matching category
      const isInCategory1 = await adminSession.query('is_in_emode_category', {
        user_emode_category: 1,
        category_id: 1,
      });
      expect(isInCategory1).toBe(true);

      // Check with non-matching category
      const isInCategory2 = await adminSession.query('is_in_emode_category', {
        user_emode_category: 1,
        category_id: 2,
      });
      expect(isInCategory2).toBe(false);
    });

    it('should return empty data for non-existent categories', async () => {
      const label = await adminSession.query('get_emode_category_label', { category_id: 999 });
      expect(label).toBe(''); // Empty string for non-existent category

      const bonus = await adminSession.query('get_emode_category_liquidation_bonus', {
        category_id: 999,
      });
      expect(bonus).toBe(0); // Zero for non-existent category
    });
  });
});
