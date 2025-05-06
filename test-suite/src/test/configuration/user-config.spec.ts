import { op, Session } from '@chromia/ft4';
import { IClient } from 'postchain-client';
import { admin_kp, user_a_kp } from '@configs/key-pair';
import { registerAccountOpen } from '@common/operations/accounts';
import { getClient } from '@/clients';

describe('User Configuration', () => {
  let adminSession: Session;
  let userSession: Session;
  let client: IClient;
  let userAccountId: string;
  let reserveId1: string;
  let reserveId2: string;

  beforeAll(async () => {
    client = await getClient();
    adminSession = await registerAccountOpen(client, admin_kp);
    userSession = await registerAccountOpen(client, user_a_kp);

    // Get user account ID
    const accounts = await userSession.query('ft4.get_accounts_by_signer', {
      id: user_a_kp.pubKey,
      page_size: 1,
      page_cursor: null,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userAccountId = (accounts as any).data?.[0]?.id || accounts[0]?.id;

    // Create user config
    await userSession.call(op('create_user_config', userAccountId));

    // Create test reserves
    const result1 = await adminSession.call(op('init_development', 'Test Reserve 1'));
    expect(result1.receipt.statusCode).toBe(200);
    reserveId1 = 'Test Reserve 1';

    const result2 = await adminSession.call(op('init_development', 'Test Reserve 2'));
    expect(result2.receipt.statusCode).toBe(200);
    reserveId2 = 'Test Reserve 2';
  });

  it('should check user config constants', async () => {
    const minHealthFactor = await userSession.query(
      'get_minimum_health_factor_liquidation_threshold'
    );
    expect(minHealthFactor).toBe('950000000000000000');

    const healthFactor = await userSession.query('get_health_factor_liquidation_threshold');
    expect(healthFactor).toBe('1000000000000000000');

    const isolatedRole = await userSession.query('get_isolated_collateral_supplier_role');
    expect(isolatedRole).toBe('ISOLATED_COLLATERAL_SUPPLIER');
  });

  it('should have empty user config by default', async () => {
    const isEmpty = await userSession.query('is_empty', { user_config: userAccountId });
    expect(isEmpty).toBe(true);

    const isBorrowing = await userSession.query('is_borrowing_any', { user_config: userAccountId });
    expect(isBorrowing).toBe(false);

    const isCollateral = await userSession.query('is_using_as_collateral_any', {
      user_config: userAccountId,
    });
    expect(isCollateral).toBe(false);
  });

  it('should set and check borrowing state', async () => {
    // Set borrowing to true
    await userSession.call(op('set_borrowing', userAccountId, reserveId1, true));

    // Check borrowing state
    const isBorrowing = await userSession.query('is_borrowing', {
      user_config: userAccountId,
      reserve_id: reserveId1,
    });
    expect(isBorrowing).toBe(true);

    const isBorrowingAny = await userSession.query('is_borrowing_any', {
      user_config: userAccountId,
    });
    expect(isBorrowingAny).toBe(true);

    const isBorrowingOne = await userSession.query('is_borrowing_one', {
      user_config: userAccountId,
    });
    expect(isBorrowingOne).toBe(true);

    // Set borrowing to false
    await userSession.call(op('set_borrowing', userAccountId, reserveId1, false));

    // Check borrowing state is reset
    const isBorrowingAfter = await userSession.query('is_borrowing', {
      user_config: userAccountId,
      reserve_id: reserveId1,
    });
    expect(isBorrowingAfter).toBe(false);
  });

  it('should set and check collateral state', async () => {
    // Set using as collateral to true
    await userSession.call(op('set_using_as_collateral', userAccountId, reserveId1, true));

    // Check collateral state
    const isCollateral = await userSession.query('is_using_as_collateral', {
      user_config: userAccountId,
      reserve_id: reserveId1,
    });
    expect(isCollateral).toBe(true);

    const isCollateralAny = await userSession.query('is_using_as_collateral_any', {
      user_config: userAccountId,
    });
    expect(isCollateralAny).toBe(true);

    // Set using as collateral to false
    await userSession.call(op('set_using_as_collateral', userAccountId, reserveId1, false));

    // Check collateral state is reset
    const isCollateralAfter = await userSession.query('is_using_as_collateral', {
      user_config: userAccountId,
      reserve_id: reserveId1,
    });
    expect(isCollateralAfter).toBe(false);
  });

  it('should handle multiple reserves', async () => {
    // Set borrowing for reserve 1
    await userSession.call(op('set_borrowing', userAccountId, reserveId1, true));

    // Set collateral for reserve 2
    await userSession.call(op('set_using_as_collateral', userAccountId, reserveId2, true));

    // Check states for each reserve
    const isBorrowing1 = await userSession.query('is_borrowing', {
      user_config: userAccountId,
      reserve_id: reserveId1,
    });
    expect(isBorrowing1).toBe(true);

    const isBorrowing2 = await userSession.query('is_borrowing', {
      user_config: userAccountId,
      reserve_id: reserveId2,
    });
    expect(isBorrowing2).toBe(false);

    const isCollateral1 = await userSession.query('is_using_as_collateral', {
      user_config: userAccountId,
      reserve_id: reserveId1,
    });
    expect(isCollateral1).toBe(false);

    const isCollateral2 = await userSession.query('is_using_as_collateral', {
      user_config: userAccountId,
      reserve_id: reserveId2,
    });
    expect(isCollateral2).toBe(true);
  });

  it('should reject operations with invalid reserve ID', async () => {
    const invalidId = 'Invalid Reserve';

    // Try to set borrowing with invalid reserve ID
    const borrowingResult = await userSession.call(
      op('set_borrowing', userAccountId, invalidId, true)
    );
    expect(borrowingResult.receipt.statusCode).not.toBe(200);

    // Try to set collateral with invalid reserve ID
    const collateralResult = await userSession.call(
      op('set_using_as_collateral', userAccountId, invalidId, true)
    );
    expect(collateralResult.receipt.statusCode).not.toBe(200);
  });
});
