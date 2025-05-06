import { op, Session } from '@chromia/ft4';
import { IClient } from 'postchain-client';
import { admin_kp } from '@configs/key-pair';
import { registerAccountOpen } from '@common/operations/accounts';
import { getClient } from '@/clients';

describe('Reserve Configuration', () => {
  let adminSession: Session;
  let client: IClient;
  let reserveId: string;

  // Constants for testing
  const LTV = 8000;
  const LIQUIDATION_BONUS = 500;
  const RESERVE_FACTOR = 1000;
  const DECIMALS = 18;
  const BORROW_CAP = 100;
  const SUPPLY_CAP = 200;
  const UNBACKED_MINT_CAP = 300;
  const EMODE_CATEGORY = 1;

  beforeAll(async () => {
    client = await getClient();
    adminSession = await registerAccountOpen(client, admin_kp);

    // Initialize a test reserve
    const result = await adminSession.call(op('init_development', 'TEST_ASSET'));
    expect(result.receipt.statusCode).toBe(200);
    reserveId = 'TEST_ASSET';
  });

  it('should set and get LTV', async () => {
    // Set LTV
    const result = await adminSession.call(op('set_ltv_development', reserveId, LTV));
    expect(result.receipt.statusCode).toBe(200);

    // Get LTV
    const ltv = await adminSession.query('get_ltv', { config: reserveId });
    expect(ltv).toBe(LTV);
  });

  it('should set and get liquidation bonus', async () => {
    // Set liquidation bonus
    const result = await adminSession.call(
      op('set_liquidation_bonus_development', reserveId, LIQUIDATION_BONUS)
    );
    expect(result.receipt.statusCode).toBe(200);

    // Get liquidation bonus
    const bonus = await adminSession.query('get_liquidation_bonus', { config: reserveId });
    expect(bonus).toBe(LIQUIDATION_BONUS);
  });

  it('should set and get decimals', async () => {
    // Set decimals
    const result = await adminSession.call(op('set_decimals_development', reserveId, DECIMALS));
    expect(result.receipt.statusCode).toBe(200);

    // Get decimals
    const decimals = await adminSession.query('get_decimals', { config: reserveId });
    expect(decimals).toBe(DECIMALS);
  });

  it('should set and get eMode category', async () => {
    // Set eMode category
    const result = await adminSession.call(
      op('set_emode_category_development', reserveId, EMODE_CATEGORY)
    );
    expect(result.receipt.statusCode).toBe(200);

    // Get eMode category
    const category = await adminSession.query('get_emode_category', { config: reserveId });
    expect(category).toBe(EMODE_CATEGORY);
  });

  it('should set and get reserve factor', async () => {
    // Set reserve factor
    const result = await adminSession.call(
      op('set_reserve_factor_development', reserveId, RESERVE_FACTOR)
    );
    expect(result.receipt.statusCode).toBe(200);

    // Get reserve factor
    const factor = await adminSession.query('get_reserve_factor', { config: reserveId });
    expect(factor).toBe(RESERVE_FACTOR);
  });

  it('should set and get frozen state', async () => {
    // Set frozen to true
    await adminSession.call(op('set_frozen_development', reserveId, true));

    // Check frozen state
    const frozen = await adminSession.query('get_frozen', { config: reserveId });
    expect(frozen).toBe(true);

    // Set frozen to false
    await adminSession.call(op('set_frozen_development', reserveId, false));

    // Check frozen state again
    const frozenAfter = await adminSession.query('get_frozen', { config: reserveId });
    expect(frozenAfter).toBe(false);
  });

  it('should set and get borrowing enabled state', async () => {
    // Set borrowing enabled to true
    await adminSession.call(op('set_borrowing_enabled_development', reserveId, true));

    // Check borrowing enabled state
    const enabled = await adminSession.query('get_borrowing_enabled', { config: reserveId });
    expect(enabled).toBe(true);

    // Set borrowing enabled to false
    await adminSession.call(op('set_borrowing_enabled_development', reserveId, false));

    // Check borrowing enabled state again
    const enabledAfter = await adminSession.query('get_borrowing_enabled', { config: reserveId });
    expect(enabledAfter).toBe(false);
  });

  it('should set and get borrow cap', async () => {
    // Set borrow cap
    await adminSession.call(op('set_borrow_cap_development', reserveId, BORROW_CAP));

    // Check borrow cap
    const cap = await adminSession.query('get_borrow_cap', { config: reserveId });
    expect(cap).toBe(BORROW_CAP);
  });

  it('should set and get supply cap', async () => {
    // Set supply cap
    await adminSession.call(op('set_supply_cap_development', reserveId, SUPPLY_CAP));

    // Check supply cap
    const cap = await adminSession.query('get_supply_cap', { config: reserveId });
    expect(cap).toBe(SUPPLY_CAP);
  });

  it('should set and get unbacked mint cap', async () => {
    // Set unbacked mint cap
    await adminSession.call(op('set_unbacked_mint_cap_development', reserveId, UNBACKED_MINT_CAP));

    // Check unbacked mint cap
    const cap = await adminSession.query('get_unbacked_mint_cap', { config: reserveId });
    expect(cap).toBe(UNBACKED_MINT_CAP);
  });

  it('should set and get flash loan enabled state', async () => {
    // Set flash loan enabled to true
    await adminSession.call(op('set_flash_loan_enabled_development', reserveId, true));

    // Check flash loan enabled state
    const enabled = await adminSession.query('get_flash_loan_enabled', { config: reserveId });
    expect(enabled).toBe(true);
  });

  it('should fail when setting invalid LTV', async () => {
    // Get max valid LTV
    const maxLtv = await adminSession.query('get_max_valid_ltv');

    // Try to set invalid LTV (above max)
    const result = await adminSession.call(
      op('set_ltv_development', reserveId, Number(maxLtv) + 1)
    );
    expect(result.receipt.statusCode).not.toBe(200);
  });
});
