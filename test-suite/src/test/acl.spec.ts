import {
  //   createConnection,
  //   createInMemoryFtKeyStore,
  //   createSingleSigAuthDescriptorRegistration,
  op,
  //   registerAccount,
  //   registrationStrategy,
  Session,
} from '@chromia/ft4';
import { IClient } from 'postchain-client';
import {
  admin_kp,
  // user_a_kp
} from '../configs/key-pair';
import { getClient } from '../clients';
import { registerAccountOpen } from '../common/operations/accounts';

// const ROLES = [
//   'POOL_ADMIN_ROLE',
//   'EMERGENCY_ADMIN_ROLE',
//   'RISK_ADMIN_ROLE',
//   'FLASH_BORROWER_ROLE',
//   'BRIDGE_ROLE',
//   'ASSET_LISTING_ADMIN_ROLE',
//   'FUNDS_ADMIN_ROLE',
//   'EMISSION_ADMIN_ROLE',
//   'ADMIN_CONTROLLED_ECOSYSTEM_RESERVE_FUNDS_ADMIN_ROLE',
//   'REWARDS_CONTROLLER_ADMIN_ROLE',
// ];

describe('ACL - Chromia FT4', () => {
  let adminSession: Session;
  //   let userSession: Session;
  let client: IClient;

  beforeAll(async () => {
    client = await getClient();
    // Admin session
    adminSession = await registerAccountOpen(client, admin_kp);
    // User session
    // userSession = await registerAccountOpen(client, user_a_kp);
  });

  it('should initialize ACL and set super admin', async () => {
    const result = await adminSession.call(op('initialize', admin_kp.pubKey));
    expect(result.receipt.statusCode).toBe(200);
    const isInitialized = await adminSession.query('is_initialized');
    console.log('isInitialized', isInitialized);
    expect(!!isInitialized).toBe(true);
    const hasRole = await adminSession.query('has_role_qr', {
      role: 'DEFAULT_ADMIN_ROLE',
      account: admin_kp.pubKey,
    });
    console.log('hasRole', hasRole);
    expect(!!hasRole).toBe(true);
  });

  //   it('should grant and revoke role', async () => {
  //     const grant = await adminSession.call(
  //       op('grant_role', 'POOL_ADMIN_ROLE', user_a_kp.pubKey, admin_kp.pubKey)
  //     );
  //     expect(grant.receipt.statusCode).toBe(200);
  //     let hasRole = await userSession.query('has_role_qr', {
  //       role: 'POOL_ADMIN_ROLE',
  //       account: user_a_kp.pubKey,
  //     });
  //     expect(hasRole).toBe(true);
  //     const revoke = await adminSession.call(
  //       op('revoke_role', 'POOL_ADMIN_ROLE', user_a_kp.pubKey, admin_kp.pubKey)
  //     );
  //     expect(revoke.receipt.statusCode).toBe(200);
  //     hasRole = await userSession.query('has_role_qr', {
  //       role: 'POOL_ADMIN_ROLE',
  //       account: user_a_kp.pubKey,
  //     });
  //     expect(hasRole).toBe(false);
  //   });

  //   it('should allow user to renounce role', async () => {
  //     await adminSession.call(op('grant_role', 'POOL_ADMIN_ROLE', user_a_kp.pubKey, admin_kp.pubKey));
  //     let hasRole = await userSession.query('has_role_qr', {
  //       role: 'POOL_ADMIN_ROLE',
  //       account: user_a_kp.pubKey,
  //     });
  //     expect(hasRole).toBe(true);
  //     const renounce = await userSession.call(
  //       op('renounce_role', 'POOL_ADMIN_ROLE', user_a_kp.pubKey)
  //     );
  //     expect(renounce.receipt.statusCode).toBe(200);
  //     hasRole = await userSession.query('has_role_qr', {
  //       role: 'POOL_ADMIN_ROLE',
  //       account: user_a_kp.pubKey,
  //     });
  //     expect(hasRole).toBe(false);
  //   });

  //   it('should set role admin and allow admin to grant custom role', async () => {
  //     const CUSTOM_ROLE = 'CUSTOM_ROLE';
  //     await adminSession.call(op('set_role_admin', CUSTOM_ROLE, 'POOL_ADMIN_ROLE', admin_kp.pubKey));
  //     await adminSession.call(op('grant_role', 'POOL_ADMIN_ROLE', user_a_kp.pubKey, admin_kp.pubKey));
  //     // User (now pool admin) grants custom role to self
  //     const grant = await userSession.call(
  //       op('grant_role', CUSTOM_ROLE, user_a_kp.pubKey, user_a_kp.pubKey)
  //     );
  //     expect(grant.receipt.statusCode).toBe(200);
  //     const hasCustomRole = await userSession.query('has_role_qr', {
  //       role: CUSTOM_ROLE,
  //       account: user_a_kp.pubKey,
  //     });
  //     expect(hasCustomRole).toBe(true);
  //   });

  //   for (const role of ROLES) {
  //     it(`should grant and check special role: ${role}`, async () => {
  //       await adminSession.call(op('grant_role', role, user_a_kp.pubKey, admin_kp.pubKey));
  //       const hasRole = await userSession.query('has_role_qr', {
  //         role,
  //         account: user_a_kp.pubKey,
  //       });
  //       expect(hasRole).toBe(true);
  //       // Check is_xxx if available
  //       const isRoleFn = `is_${role.toLowerCase()}`.replace(/_role$/, '');
  //       try {
  //         const isRole = await userSession.query(isRoleFn, { account: user_a_kp.pubKey });
  //         expect(isRole).toBe(true);
  //       } catch {
  //         // Query does not exist, skip
  //       }
  //       await adminSession.call(op('revoke_role', role, user_a_kp.pubKey, admin_kp.pubKey));
  //       const hasRoleAfter = await userSession.query('has_role_qr', {
  //         role,
  //         account: user_a_kp.pubKey,
  //       });
  //       expect(hasRoleAfter).toBe(false);
  //     });
  //   }
});
