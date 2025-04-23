// get tx link from tx hash
import { env } from '@/types/utils/env';

export const getTxLink = (txHash: string) => {
  // example: https://explorer.chromia.com/testnet/1A0F8951E73D53B142809D73AF8297746461204BAF6569F3DF2748F2ADA620FA/transaction/FD93D8E5430B718AF37550013C1C65948FB4A03FD1C11800C3AF6FEE5B526E33
  return `https://explorer.chromia.com/${env.network}/${env.brid}/transaction/${txHash}`;
};
