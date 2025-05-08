import { op, Session } from '@chromia/ft4';
import { IClient } from 'postchain-client';
import { admin_kp } from '@configs/key-pair';
import { registerAccountOpen } from '@common/operations/accounts';
import { getClient } from '@/clients';

// Test constants
const TEST_ASSET_ID_STORK_BTC = 'BTCUSD';
const TEST_PRICE_BTC = 53453.2525;
const TEST_TIMESTAMP_BTC = 1698765432;
const TEST_NAME_BTC = 'Bitcoin';
const TEST_SYMBOL_BTC = 'BTC';
const TEST_DECIMALS_BTC = 8;
const TEST_ICON_BTC = 'https://example.com/icon.png';

const TEST_ASSET_ID_STORK_ETH = 'ETHUSD';
const TEST_PRICE_ETH = 1800.2525;
const TEST_TIMESTAMP_ETH = 1698765789;
const TEST_NAME_ETH = 'Ethereum';
const TEST_SYMBOL_ETH = 'ETH';
const TEST_DECIMALS_ETH = 8;
const TEST_ICON_ETH = 'https://example.com/icon.png';

describe('Stork Oracle', () => {
  let adminSession: Session;
  let client: IClient;
  let assetIdBtc: Buffer<ArrayBufferLike>;
  let assetIdEth: Buffer<ArrayBufferLike>;

  beforeAll(async () => {
    client = await getClient();
    adminSession = await registerAccountOpen(client, admin_kp);

    // initialize ACL module with pool_admin
    await adminSession.call(op('initialize', admin_kp.pubKey));

    // Grant POOL_ADMIN_ROLE to pool_admin account
    await adminSession.call(
      op('grant_role', 'POOL_ADMIN', adminSession.account.id, admin_kp.pubKey)
    );

    // initialize underlying asset factory
    await adminSession.call(op('initialize_underlying_asset_factory'));

    //

    assetIdBtc = await initOracleAsset(
      TEST_NAME_BTC,
      TEST_SYMBOL_BTC,
      TEST_DECIMALS_BTC,
      TEST_ICON_BTC,
      TEST_ASSET_ID_STORK_BTC,
      TEST_PRICE_BTC,
      TEST_TIMESTAMP_BTC
    );

    assetIdEth = await initOracleAsset(
      TEST_NAME_ETH,
      TEST_SYMBOL_ETH,
      TEST_DECIMALS_ETH,
      TEST_ICON_ETH,
      TEST_ASSET_ID_STORK_ETH,
      TEST_PRICE_ETH,
      TEST_TIMESTAMP_ETH
    );
  });

  async function initOracleAsset(
    assetName: string,
    symbol: string,
    decimals: number,
    icon: string,
    storkAssetId: string,
    price: number,
    timestamp: number
  ) {
    // Register asset
    await adminSession.call(op('create_underlying_asset', assetName, symbol, decimals, icon));

    const assets = await adminSession.getAssetsBySymbol(symbol);
    const assetId = assets.data[0].id;

    // Create price asset
    await adminSession.call(op('create_price_asset', admin_kp.pubKey, storkAssetId, assetId));

    // Mock price update
    await adminSession.call(
      op('handle_price_update_op', [
        {
          asset: storkAssetId,
          stork_price: {
            price: BigInt(price * 1e18),
            signature: {
              signer: Buffer.from('000000').toString('hex'),
              r: Buffer.from('000000').toString('hex'),
              s: Buffer.from('000000').toString('hex'),
              v: Buffer.from('000000').toString('hex'),
            },
            timestamp_nanos: timestamp * 1e6,
            merkle_root: Buffer.from('123456').toString('hex'),
            type: 'SPOT',
            version: '1.0',
            checksum: Buffer.from('654321').toString('hex'),
          },
          publisher_prices: [],
        },
      ])
    );

    return assetId;
  }

  it('should handle price updates', async () => {
    // Verify price was stored
    const price = await adminSession.query('get_latest_price_by_asset', {
      stork_asset_id: TEST_ASSET_ID_STORK_BTC,
    });

    expect(price).toEqual(TEST_PRICE_BTC);
  });

  it('should get latest price by asset ID', async () => {
    const price = await adminSession.query('get_latest_price_by_asset_id', {
      asset_id: assetIdBtc,
    });

    expect(price).toEqual(TEST_PRICE_BTC);
  });

  it('should get latest prices by asset IDs', async () => {
    const prices = (await adminSession.query('get_latest_price_by_asset_ids', {
      asset_ids: [assetIdBtc, assetIdEth],
    })) as Array<{ price: number }>;

    expect(prices.length).toBe(2);
    expect(prices[0].price).toEqual(TEST_PRICE_BTC);
    expect(prices[1].price).toEqual(TEST_PRICE_ETH);
  });

  it('should get latest price by asset', async () => {
    const price = await adminSession.query('get_latest_price_by_asset', {
      stork_asset_id: TEST_ASSET_ID_STORK_BTC,
    });

    expect(price).toEqual(TEST_PRICE_BTC);
  });

  it('should get latest prices by assets', async () => {
    const prices = (await adminSession.query('get_latest_price_by_assets', {
      stork_asset_ids: [TEST_ASSET_ID_STORK_BTC, TEST_ASSET_ID_STORK_ETH],
    })) as Array<{ price: number }>;

    expect(prices.length).toBe(2);
    expect(prices[0].price).toEqual(TEST_PRICE_BTC);
    expect(prices[1].price).toEqual(TEST_PRICE_ETH);
  });
});
