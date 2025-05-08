import { op } from '@chromia/ft4';
import { admin_kp, user_a_kp } from '@configs/key-pair';
import { registerAccountOpen } from '@common/operations/accounts';
import { getClient } from '@/clients';

async function initSupply() {
  try {
    // Get client and setup sessions
    const client = await getClient();
    const adminSession = await registerAccountOpen(client, admin_kp);
    const adminAccountId = adminSession.account.id;

    const userSession = await registerAccountOpen(client, user_a_kp);
    const userAccountId = userSession.account.id;

    console.log('Sessions created successfully');

    // Initialize ACL module
    await adminSession.call(op('initialize', admin_kp.pubKey));
    await adminSession.call(op('grant_role', 'POOL_ADMIN', adminAccountId, admin_kp.pubKey));
    console.log('ACL module initialized');

    // Initialize required factories
    await adminSession.call(op('initialize_asset_base'));
    await adminSession.call(op('initialize_underlying_asset_factory'));
    await adminSession.call(op('initialize_a_asset_factory'));
    console.log('Asset factories initialized');

    // Create underlying asset
    const underlyingAsset = {
      name: 'Test Underlying Token',
      symbol: 'TUT',
      decimals: 6,
      icon: 'http://example.com/icon.png',
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

    const underlyingAssetResult = await adminSession.getAssetsBySymbol(underlyingAsset.symbol);
    const underlyingAssetId = underlyingAssetResult.data[0].id;
    console.log('Underlying asset created:', underlyingAsset.symbol, underlyingAssetId);

    // Set interest rate strategy
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
    console.log('Interest rate strategy set');

    // Configure reserve with a-asset
    const aAsset = {
      name: 'Test A Token',
      symbol: 'TAT',
      decimals: 6,
    };

    await adminSession.call(
      op('init_reserve_op', underlyingAssetId, adminAccountId, aAsset.name, aAsset.symbol, '', '')
    );

    const aAssetResult = await adminSession.getAssetsBySymbol(aAsset.symbol);
    const aAssetId = aAssetResult.data[0].id;
    console.log('Reserve initialized with a-asset:', aAsset.symbol, aAssetId);

    // Mint underlying tokens to user
    const mintAmount = 100 * 10 ** 27; // 100 RAY
    await adminSession.call(
      op('mint_underlying_asset', userAccountId, mintAmount, underlyingAssetId)
    );
    console.log(`Minted ${mintAmount} tokens to user`);

    // Supply operation
    const supplyAmount = 50 * 10 ** 27; // 50 RAY
    const result = await userSession.call(
      op(
        'supply',
        userAccountId,
        underlyingAssetId,
        supplyAmount,
        userAccountId,
        0 // referral code
      )
    );
    console.log(
      'Supply operation completed:',
      result.receipt.statusCode === 200 ? 'Success' : 'Failed'
    );

    // Check final balances
    const finalUnderlyingBalance = await adminSession.query('balance_of', {
      account_id: userAccountId,
      asset_id: underlyingAssetId,
    });

    const finalAAssetBalance = await adminSession.query('balance_of', {
      account_id: userAccountId,
      asset_id: aAssetId,
    });

    console.log('Final underlying balance:', finalUnderlyingBalance);
    console.log('Final a-asset balance:', finalAAssetBalance);

    console.log('Supply initialization completed successfully');
  } catch (error) {
    console.error('Error in initSupply:', error);
  }
}

// Execute the script
initSupply().catch(console.error);
