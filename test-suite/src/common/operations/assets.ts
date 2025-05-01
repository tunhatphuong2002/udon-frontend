import { createAmount, mint, registerAsset, Session } from '@chromia/ft4';
import { signatureProviderAdmin } from '../../configs/key-pair';
// import { tokens } from '../../configs/tokens';
import { ensureBuffer } from '../../helpers/buffer';
// import chalk from 'chalk';

export async function registerAssetOp(
  session: Session,
  name: string,
  symbol: string,
  decimals: number,
  iconUrl: string
) {
  try {
    // https://docs.chromia.com/pages/ft4-ts-client/client/functions/admin.registerAsset.html
    const asset = await registerAsset(
      session.account.connection.client,
      signatureProviderAdmin,
      name,
      symbol,
      decimals,
      iconUrl
    );

    console.log(`Registered asset ${name}`, asset);
  } catch (error) {
    console.log(`Error registering asset ${name}`, error);
  }
}

// export async function mintAssetOp(session: Session, receiver: string) {
//   for (const token of Object.values(tokens)) {
//     try {
//       // get assetId
//       const assets = await session.getAssetsBySymbol(token.symbol);

//       const assetId = assets.data[0].id;

//       // mint asset
//       // https://docs.chromia.com/pages/ft4-ts-client/client/functions/admin.mint.html
//       const mintAsset = await mint(
//         session.account.connection.client,
//         signatureProviderAdmin,
//         ensureBuffer(receiver),
//         assetId,
//         createAmount(100, token.decimal)
//       );

//       console.log(`Minted ${token.symbol} to ${receiver}`, mintAsset);
//     } catch (error) {
//       console.log(`Error minting asset ${token.symbol}`, error);
//     }
//   }
// }

export async function mintAssetOp(
  session: Session,
  receiver: string,
  symbol: string,
  amount: number
  // decimal: number
) {
  try {
    // get assetId
    const assets = await session.getAssetsBySymbol(symbol);

    const assetId = assets.data[0].id;

    // mint asset
    // https://docs.chromia.com/pages/ft4-ts-client/client/functions/admin.mint.html
    const mintAsset = await mint(
      session.account.connection.client,
      signatureProviderAdmin,
      ensureBuffer(receiver),
      assetId,
      createAmount(amount)
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
  sender: string,
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

  console.log(assetId, 'assetId');
  const resultBurn = await session.account.burn(assetId, createAmount(100000, decimal));
  console.log(resultBurn, 'resultBurn');

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
