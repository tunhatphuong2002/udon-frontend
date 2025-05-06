import { createAmount, op, Session } from '@chromia/ft4';
import { ensureBuffer } from '../../helpers/buffer';

export async function registerAssetOp(
  session: Session,
  name: string,
  symbol: string,
  decimals: number,
  iconUrl: string
) {
  try {
    const asset = await session.call(
      op('ft4.admin.register_asset', name, symbol, decimals, iconUrl)
    );

    console.log(`Registered asset ${name}`, asset);
  } catch (error) {
    console.log(`Error registering asset ${name}`, error);
  }
}

export async function mintAssetOp(
  session: Session,
  receiver: string,
  symbol: string,
  amount: number
) {
  try {
    // get assetId
    const assets = await session.getAssetsBySymbol(symbol);
    const assetId = assets.data[0].id;

    // mint asset
    const mintAsset = await session.call(
      op('ft4.admin.register_asset', ensureBuffer(receiver), assetId, BigInt(amount))
    );

    console.log(`Minted ${symbol} to ${receiver}`, mintAsset);
  } catch (error) {
    console.log(`Error minting asset ${symbol}`, error);
  }
}

export async function transferAssetOp(
  session: Session,
  assetSymbol: string,
  decimal: number,
  receiver: string
) {
  const assets = await session.getAssetsBySymbol(assetSymbol);
  const assetId = assets.data[0].id;
  const dataTransfer = await session.account.transfer(
    ensureBuffer(receiver),
    assetId,
    createAmount(100, decimal)
  );

  console.log(`Transferred ${assetSymbol} to ${receiver}`, dataTransfer);
}

export async function burnAssetOp(session: Session, assetSymbol: string, decimal: number) {
  const assets = await session.getAssetsBySymbol(assetSymbol);
  const assetId = assets.data[0].id;
  const resultBurn = await session.account.burn(assetId, createAmount(100000, decimal));

  console.log(`Burned ${assetSymbol}`, resultBurn);
}

export async function getTransactionHistory(session: Session) {
  const result = await session.account.getTransferHistory();
  console.log('Transaction history:', result);
}

export async function getPendingTransfer(session: Session) {
  const result = await session.account.getPendingCrosschainTransfers();
  console.log('Pending transfer:', result);
}
