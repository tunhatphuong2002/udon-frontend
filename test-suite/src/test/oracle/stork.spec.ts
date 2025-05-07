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

  beforeAll(async () => {
    client = await getClient();
    adminSession = await registerAccountOpen(client, admin_kp);
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

    // Get asset ID
    const assetId = await adminSession.query('get_asset_id', { name: assetName });

    // Create price asset
    await adminSession.call(op('create_price_asset', admin_kp.pubKey, storkAssetId, assetId));

    // Mock price update
    const mockData = {
      asset: storkAssetId,
      stork_price: {
        price: price * 1e18, // Convert to 18 decimals
        signature: {
          signer: '000000',
          r: '000000',
          s: '000000',
          v: '000000',
        },
        timestamp_nanos: timestamp * 1e6,
        merkle_root: '123456',
        type: 'SPOT',
        version: '1.0',
        checksum: '654321',
      },
      publisher_prices: [],
    };

    await adminSession.call(op('handle_price_update_op', mockData));
  }

  it('should handle price updates', async () => {
    await initOracleAsset(
      TEST_NAME_BTC,
      TEST_SYMBOL_BTC,
      TEST_DECIMALS_BTC,
      TEST_ICON_BTC,
      TEST_ASSET_ID_STORK_BTC,
      TEST_PRICE_BTC,
      TEST_TIMESTAMP_BTC
    );

    // Verify price was stored
    const price = await adminSession.query('get_latest_price_by_asset', {
      stork_asset_id: TEST_ASSET_ID_STORK_BTC,
    });

    expect(price).toBeCloseTo(TEST_PRICE_BTC, 4);
  });

  it('should get latest price by asset ID', async () => {
    await initOracleAsset(
      TEST_NAME_BTC,
      TEST_SYMBOL_BTC,
      TEST_DECIMALS_BTC,
      TEST_ICON_BTC,
      TEST_ASSET_ID_STORK_BTC,
      TEST_PRICE_BTC,
      TEST_TIMESTAMP_BTC
    );

    const assetId = await adminSession.query('get_asset_id', { name: TEST_NAME_BTC });
    const price = await adminSession.query('get_latest_price_by_asset_id', {
      asset_id: assetId,
    });

    expect(price).toBeCloseTo(TEST_PRICE_BTC, 4);
  });

  it('should get latest prices by asset IDs', async () => {
    await initOracleAsset(
      TEST_NAME_BTC,
      TEST_SYMBOL_BTC,
      TEST_DECIMALS_BTC,
      TEST_ICON_BTC,
      TEST_ASSET_ID_STORK_BTC,
      TEST_PRICE_BTC,
      TEST_TIMESTAMP_BTC
    );

    await initOracleAsset(
      TEST_NAME_ETH,
      TEST_SYMBOL_ETH,
      TEST_DECIMALS_ETH,
      TEST_ICON_ETH,
      TEST_ASSET_ID_STORK_ETH,
      TEST_PRICE_ETH,
      TEST_TIMESTAMP_ETH
    );

    const assetIdBtc = await adminSession.query('get_asset_id', { name: TEST_NAME_BTC });
    const assetIdEth = await adminSession.query('get_asset_id', { name: TEST_NAME_ETH });

    const prices = (await adminSession.query('get_latest_price_by_asset_ids', {
      asset_ids: [assetIdBtc, assetIdEth],
    })) as Array<{ price: number }>;

    expect(prices.length).toBe(2);
    expect(prices[0].price).toBeCloseTo(TEST_PRICE_BTC, 4);
    expect(prices[1].price).toBeCloseTo(TEST_PRICE_ETH, 4);
  });

  it('should get latest price by asset', async () => {
    await initOracleAsset(
      TEST_NAME_BTC,
      TEST_SYMBOL_BTC,
      TEST_DECIMALS_BTC,
      TEST_ICON_BTC,
      TEST_ASSET_ID_STORK_BTC,
      TEST_PRICE_BTC,
      TEST_TIMESTAMP_BTC
    );

    const price = await adminSession.query('get_latest_price_by_asset', {
      stork_asset_id: TEST_ASSET_ID_STORK_BTC,
    });

    expect(price).toBeCloseTo(TEST_PRICE_BTC, 4);
  });

  it('should get latest prices by assets', async () => {
    await initOracleAsset(
      TEST_NAME_BTC,
      TEST_SYMBOL_BTC,
      TEST_DECIMALS_BTC,
      TEST_ICON_BTC,
      TEST_ASSET_ID_STORK_BTC,
      TEST_PRICE_BTC,
      TEST_TIMESTAMP_BTC
    );

    await initOracleAsset(
      TEST_NAME_ETH,
      TEST_SYMBOL_ETH,
      TEST_DECIMALS_ETH,
      TEST_ICON_ETH,
      TEST_ASSET_ID_STORK_ETH,
      TEST_PRICE_ETH,
      TEST_TIMESTAMP_ETH
    );

    const prices = (await adminSession.query('get_latest_price_by_assets', {
      stork_asset_ids: [TEST_ASSET_ID_STORK_BTC, TEST_ASSET_ID_STORK_ETH],
    })) as Array<{ price: number }>;

    expect(prices.length).toBe(2);
    expect(prices[0].price).toBeCloseTo(TEST_PRICE_BTC, 4);
    expect(prices[1].price).toBeCloseTo(TEST_PRICE_ETH, 4);
  });
});
