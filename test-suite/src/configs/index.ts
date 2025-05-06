import path from 'path';
import dotenv from 'dotenv';

dotenv.config();
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

interface TestEnv {
  NODE_URL: string;
  BLOCKCHAIN_RID: string;
}

export const testEnv: TestEnv = {
  NODE_URL: process.env.NODE_URL || '',
  BLOCKCHAIN_RID: process.env.BLOCKCHAIN_RID || '',
} as TestEnv;

export async function getTestAccounts(): Promise<string[]> {
  // 1. create accounts
  const accounts: string[] = [];
  return accounts;
}

export async function initializeTestSuit() {
  //   // account manage
  //   testEnv.users = await getTestAccounts();
  //   // eslint-disable-next-line prefer-destructuring
  //   testEnv.emergencyAdmin = testEnv.users[1];
  //   // eslint-disable-next-line prefer-destructuring
  //   testEnv.riskAdmin = testEnv.users[2];
  //   testEnv.aDai = aTokens.find((token) => token.symbol === ADAI).metadataAddress;
  //   testEnv.aUsdc = aTokens.find((token) => token.symbol === AUSDC).metadataAddress;
  //   testEnv.aWETH = aTokens.find((token) => token.symbol === AWETH).metadataAddress;
  //   testEnv.aAave = aTokens.find((token) => token.symbol === AAAVE).metadataAddress;
  //   testEnv.vDai = varTokens.find((token) => token.symbol === VDAI).metadataAddress;
  //   testEnv.dai = underlyingTokens.find((token) => token.symbol === DAI).accountAddress;
  //   testEnv.aave = underlyingTokens.find((token) => token.symbol === AAVE).accountAddress;
  //   testEnv.usdc = underlyingTokens.find((token) => token.symbol === USDC).accountAddress;
  //   testEnv.weth = underlyingTokens.find((token) => token.symbol === WETH).accountAddress;
  //   const aclClient = new AclClient(aptosProvider, AclManager);
  //   // setup admins
  //   const isRiskAdmin = await aclClient.isRiskAdmin(testEnv.riskAdmin.accountAddress);
  //   if (!isRiskAdmin) {
  //     await aclClient.addAssetListingAdmin(testEnv.riskAdmin.accountAddress);
  //   }
  //   const isEmergencyAdmin = await aclClient.isEmergencyAdmin(testEnv.emergencyAdmin.accountAddress);
  //   if (!isEmergencyAdmin) {
  //     await aclClient.addEmergencyAdmin(testEnv.emergencyAdmin.accountAddress);
  //   }
}
