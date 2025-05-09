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

export async function initializeTestSuit() {}
