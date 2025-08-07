import { createInMemoryFtKeyStore } from '@chromia/ft4';

import { newSignatureProvider } from 'postchain-client';
import chalk from 'chalk';
import { admin_udon_testnet_kp } from '../../configs/key-pair';
import { getClient } from '../../clients';
import { registerAssetWithValidation } from '../../helpers';

/**
 * Creates a key store from private and public key
 * @param privateKey Private key in hex format
 * @param publicKey Public key in hex format
 * @returns The created key store
 */
export function createKeyStore(privateKey: string, publicKey: string) {
  return createInMemoryFtKeyStore({
    privKey: Buffer.from(privateKey, 'hex'),
    pubKey: Buffer.from(publicKey, 'hex'),
  });
}
/**
 * Example of how to use the modular functions for a complete cross-chain transfer
 * This demonstrates the full flow using the reusable functions
 */
export async function runRegisterAssetTransferExample() {
  try {
    console.log(chalk.bold.cyan(`=== Starting Cross-Chain Transfer Example ===`));

    // Create admin signature provider for asset registration
    const adminSignatureProvider = newSignatureProvider(0, admin_udon_testnet_kp);

    const udonClient = await getClient();

    // Register the asset on Udon chain
    await registerAssetWithValidation(
      '9EF73A786A66F435B3B40E72F5E9D85A4B09815997E087C809913E1E7EC686B4', // chr asset_id
      '090BCD47149FBB66F02489372E88A454E7A5645ADDE82125D40DF1EF0C76F874', // eco id
      udonClient,
      adminSignatureProvider
    );

    // Register the asset on Udon chain
    await registerAssetWithValidation(
      'BA4904DEF1320852597389EB03E1D196D686F0103DC3AF72739A176B5057785A', // alice asset_id
      '221EF06183BD9A0781FBF18CA6D4F55A0992FDD478E771721DE8F9EF3B289D5B', // token chain id
      udonClient,
      adminSignatureProvider
    );

    // Register the asset on Udon chain
    await registerAssetWithValidation(
      'DE1F8927D0780DFA54CD8ED10836D36BF2DC8493EEE64980815BB7FF7A5BDBA6', // D asset_id
      '221EF06183BD9A0781FBF18CA6D4F55A0992FDD478E771721DE8F9EF3B289D5B', // token chain id
      udonClient,
      adminSignatureProvider
    );

    console.log(
      chalk.bold.green(`\n✅✅✅ Cross-chain transfer example completed successfully ✅✅✅`)
    );
  } catch (error) {
    console.error(chalk.bold.red('❌❌❌ ERROR IN CROSS-CHAIN TRANSFER EXAMPLE ❌❌❌'));
    console.error(chalk.red(error));
    throw error;
  }
}

// When running this script directly, execute the example
if (require.main === module) {
  runRegisterAssetTransferExample()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(chalk.bold.red('❌ Unhandled error:'));
      console.error(chalk.red(error));
      process.exit(1);
    });
}
