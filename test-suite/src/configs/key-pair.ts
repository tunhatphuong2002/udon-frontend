import { newSignatureProvider } from 'postchain-client';

export const admin_kp = {
  privKey: Buffer.from('5FA2E76BCDE5C548C34D91E96B76C4FBDAE5C1410FA7F55CF6FE2D6B0A2D073A', 'hex'),
  pubKey: Buffer.from('033CBF397B79E38FFE68B9CD40B00C70785D9CCD8E1C9EA47674FA4091CA3BBADD', 'hex'),
};

// User A keypair (Alice from Rell test)
export const user_a_kp = {
  privKey: Buffer.from('AB481C53C98BF62638BB5B1139EB94AE3D29DDEE2DEF9E05807849E36077A34D', 'hex'),
  pubKey: Buffer.from('037CF87532028A85F1DBD990449917A76C858580851D42113148F648DF3E04DC9A', 'hex'),
};

// User B keypair (Bob from Rell test)
export const user_b_kp = {
  privKey: Buffer.from('D6B699AF5B5DDF662EF308062392B9C0775D53CA3DF2DF2D360C2FB3FFF4B8EE', 'hex'),
  pubKey: Buffer.from('022B9999BD51F728621497DCDDBF29F171A311A0DB6B0C60EA5C2F2B2028A15F92', 'hex'),
};

export const signatureProviderAdmin = newSignatureProvider(1, { privKey: admin_kp.privKey });
export const signatureProviderUserA = newSignatureProvider(1, { privKey: user_a_kp.privKey });
export const signatureProviderUserB = newSignatureProvider(1, { privKey: user_b_kp.privKey });
