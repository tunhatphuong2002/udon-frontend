import { readFileSync } from 'fs';
import { join } from 'path';

const accountPath = join(__dirname, '../.secret/account.json');
const accountData = JSON.parse(readFileSync(accountPath, 'utf8'));

export const admin_kp = {
  privKey: Buffer.from(accountData.udon_account.admin.privkey, 'hex'),
  pubKey: Buffer.from(accountData.udon_account.admin.pubkey, 'hex'),
};

// User A keypair (Alice from Rell test)
export const user_a_kp = {
  privKey: Buffer.from(accountData.udon_account.user_a.privkey, 'hex'),
  pubKey: Buffer.from(accountData.udon_account.user_a.pubkey, 'hex'),
};

// User B keypair (Bob from Rell test)
export const user_b_kp = {
  privKey: Buffer.from(accountData.udon_account.user_b.privkey, 'hex'),
  pubKey: Buffer.from(accountData.udon_account.user_b.pubkey, 'hex'),
};
