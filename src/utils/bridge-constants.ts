// Shared constants for bridge and token data
// Used by both deposit-to-udon-dialog.tsx and withdraw-from-udon-dialog.tsx

export interface Token {
  name: string;
  symbol: string;
  decimals: number;
  icon: string;
}

export interface BridgeOption {
  name: string;
  url: string;
}

// Chain Bridge IDs
export const BRIDGE_IDS = {
  // From Bridge IDs (source chains)
  FROM_BRID: {
    ECONOMY_CHAIN: '15C0CA99BEE60A3B23829968771C50E491BD00D2E3AE448580CD48A8D71E7BBA',
    TOKEN_CHAIN: '8035EBF322D0057B00E1D596431A78D535DB45035FAF2045B76942034C0FC507',
    MINES_OF_DALARNIA: '5dceac1cafe8ce46284b4ffa739c55567f3b91147db27ff2e40ffd963c39bb8e',
    COLORPOOL_DEX: '19571DCB739CCDDC4BC8B96A01C7BDE9FCC389B566DD1B85737E892695674288',
  },
  // To Bridge ID (destination - Udon Protocol)
  TO_BRID: 'F4E33267A8FF1ACCE3C6D7B441B8542FB84FF6DAA5114105563D2AA34979BEF6',
} as const;

// Token IDs for different chains
export const TOKEN_IDS = {
  // ColorPool DEX Chain IDs
  COLORPOOL_DEX: {
    CHR: '5f16d1545a0881f971b164f1601cbbf51c29efd0633b2730da18c403c3b428b5',
    ALICE: '9084de203ef2afc7c6bfd647660aa3265d3b9ef1105139077ed3c81b26e2976e',
    D: 'd85153c53bc78c6bf177113c5da873669f97bd46db1ab7411e2f8932c7cdd0a8',
  },
  // Token Chain IDs
  TOKEN_CHAIN: {
    CHR: '5f16d1545a0881f971b164f1601cbbf51c29efd0633b2730da18c403c3b428b5',
    ALICE: '9084de203ef2afc7c6bfd647660aa3265d3b9ef1105139077ed3c81b26e2976e',
    D: 'd85153c53bc78c6bf177113c5da873669f97bd46db1ab7411e2f8932c7cdd0a8',
  },
  // Mines of Dalarnia Chain IDs
  MINES_OF_DALARNIA: {
    D: '249005bc098a47e9d16ff4b87ecdadec1da81a42cd0cfc51100558ebf4b00e42',
    DAR: '0ec2a4f5a9f7a76b6c28e7fc9f3a8d7abf535499db394db3088035bb0dc569d2',
    COPPER: 'cc8a7a8bf6009280f245c275c4ac5530881837261ae4f9de766a1551c801fdc6',
    IRON: 'd5bc28465b8f42a42c913610f9e0f3b7ba26879cf08403832e8265ebab2e93e7',
    SILVER: '0c285d251658838827b256b79cadfcff697e170978ca76f8bc492e80402a0405',
    OZYMODIUM: '06b6fa51f7a522d608942f35ec1282ea5794763dc79dfd22659e6ac555493fe9',
    GOLD: '19e2c73d4ae8a660e601603c37d5efc9eb5194665308155f5541adf51c02de52',
    CRAFT_CATALYST: 'f1bb301976de20f93407da4fcd8055ab8c01d89bd99b2eb047d2184c0413ead8',
    COMBINE_CATALYST: '736b6c09b108f842b98f678d2d8e4b1644959944356844441b2053b9e2a00506',
    STELLAR_SHARD: '7de5db71e4ed1dbd8cd89ac05728715a97eedd8d23f9bbb2522bbf5130ba6103',
    RAGNARITE: '285bde6d08e8e8502afb196d79baecd1989893acbbe8b28f4f27420ee2f13cb7',
    AQUARITE: '2a50a54aa721deb5eb5ce3cfa25ff6b8acfd421f408d35e334e28afac3a7e39f',
    JUNGLE_GEM: 'afd4e1152fbeaf3dc644b87e778e83c0c82c9ef6721c8ee36b579d857512091f',
    CRYPTONITE: '93057bc2085599336e3232b3a95ea883991eff65f5ff22533cecc6934353ee6e',
    ROCKSIDIAN: 'd5f07eb434b2fe1a84b9ba4442291c24b46ed0210ac193a96341c1b01429f919',
    DUST_COPPER: '06e67dac90156c9cb66bd533771d073ad27d4376b23055fcc7d3072ada3a014c',
    DUST_IRON: 'a28491085810da4df35e7f6feacbb6448054f1a4bdcab61f7b95d247f3e75dae',
    DUST_SILVER: '0ca0c11aa0d7676696d0b7b378df0b752425ec11a6c4652cabb8bae21ebcfa3f',
    DUST_OZYMODIUM: 'd42f57b02ba062a11dcfda9e5503c16a574dd77e52c47a251cb07be228cd1392',
    DUST_GOLD: 'f0fc339e73feeac6d286440bfd72c7c2a6b3a8d208234c26928b5b46ad29a6eb',
    DUST_RAGNARITE: '55aad00b1d2353c14b2259234fa8bf54ffb2496f8eba38391c714963974708c6',
    DUST_AQUARITE: '8613de74be83f2eed8ef18525802ec0d66e000ceacafe7800088a3e1019579b9',
  },
  // Economy Chain IDs
  ECONOMY_CHAIN: {
    CHR: '5f16d1545a0881f971b164f1601cbbf51c29efd0633b2730da18c403c3b428b5',
    ALICE: '9084de203ef2afc7c6bfd647660aa3265d3b9ef1105139077ed3c81b26e2976e',
    D: 'd85153c53bc78c6bf177113c5da873669f97bd46db1ab7411e2f8932c7cdd0a8',
  },
  // Udon Protocol Chain IDs
  UDON: {
    CHR: '5f16d1545a0881f971b164f1601cbbf51c29efd0633b2730da18c403c3b428b5',
    ALICE: '9084de203ef2afc7c6bfd647660aa3265d3b9ef1105139077ed3c81b26e2976e',
    D: 'd85153c53bc78c6bf177113c5da873669f97bd46db1ab7411e2f8932c7cdd0a8',
    aALICE: '2c7e76452dbd5922cd336926f2b8021618f2ff93dda97bbf1c0e73583d724954',
    vALICE: '824328a5e84076ae1b182c02fb047ce836208773e7253031fef1ecacb21584a0',
    aD: 'b8932cdf06ed10ff01d027f63af34b29806e0d7b0f9e301dfb42cce0045909ab',
    vD: '2e24145b99172a9594a4039b8cf2b7e659c5c6e8ec1c74bed3fbf549e4ba3431',
    aCHR: 'c0b98f18a803268e915acb7b5cce371cf535559735e6c63ca17d6af7a8fd74bf',
    vCHR: '97dfe8d8745172c7295256ac18ddb4e8ee816151f02f3861065afeca48d59ce1',
  },
} as const;

// Mainnet tokens list
export const TOKENS_MAINNET: Token[] = [
  {
    name: 'ALICE',
    symbol: 'ALICE',
    decimals: 6,
    icon: 'https://s2.coinmarketcap.com/static/img/coins/128x128/8766.png',
  },
  {
    name: 'DAR Open Network',
    symbol: 'D',
    decimals: 6,
    icon: 'https://s2.coinmarketcap.com/static/img/coins/128x128/11374.png',
  },
  {
    name: 'Chromia',
    symbol: 'CHR',
    decimals: 6,
    icon: 'https://s2.coinmarketcap.com/static/img/coins/128x128/3978.png',
  },
];

// Helper functions
export const getDepositOptions = (symbol: string): BridgeOption[] => {
  switch (symbol) {
    case 'CHR':
      return [
        {
          name: 'Economy Chain',
          url: `https://vault.chromia.com/en/transfer/?fromBrid=${BRIDGE_IDS.FROM_BRID.ECONOMY_CHAIN}&toBrid=${BRIDGE_IDS.TO_BRID}&token=${TOKEN_IDS.ECONOMY_CHAIN.CHR}`,
        },
        {
          name: 'ColorPool DEX',
          url: `https://vault.chromia.com/en/transfer/?fromBrid=${BRIDGE_IDS.FROM_BRID.COLORPOOL_DEX}&toBrid=${BRIDGE_IDS.TO_BRID}&token=${TOKEN_IDS.COLORPOOL_DEX.CHR}`,
        },
      ];
    case 'D':
      return [
        {
          name: 'Token Chain',
          url: `https://vault.chromia.com/en/transfer/?fromBrid=${BRIDGE_IDS.FROM_BRID.TOKEN_CHAIN}&toBrid=${BRIDGE_IDS.TO_BRID}&token=${TOKEN_IDS.TOKEN_CHAIN.D}`,
        },
        {
          name: 'Mines of Dalarnia Chain',
          url: `https://vault.chromia.com/en/transfer/?fromBrid=${BRIDGE_IDS.FROM_BRID.MINES_OF_DALARNIA}&toBrid=${BRIDGE_IDS.TO_BRID}&token=${TOKEN_IDS.MINES_OF_DALARNIA.D}`,
        },
        {
          name: 'ColorPool DEX',
          url: `https://vault.chromia.com/en/transfer/?fromBrid=${BRIDGE_IDS.FROM_BRID.COLORPOOL_DEX}&toBrid=${BRIDGE_IDS.TO_BRID}&token=${TOKEN_IDS.COLORPOOL_DEX.D}`,
        },
      ];
    case 'ALICE':
      return [
        {
          name: 'Token Chain',
          url: `https://vault.chromia.com/en/transfer/?fromBrid=${BRIDGE_IDS.FROM_BRID.TOKEN_CHAIN}&toBrid=${BRIDGE_IDS.TO_BRID}&token=${TOKEN_IDS.TOKEN_CHAIN.ALICE}`,
        },
        {
          name: 'ColorPool DEX',
          url: `https://vault.chromia.com/en/transfer/?fromBrid=${BRIDGE_IDS.FROM_BRID.COLORPOOL_DEX}&toBrid=${BRIDGE_IDS.TO_BRID}&token=${TOKEN_IDS.COLORPOOL_DEX.ALICE}`,
        },
      ];
    default:
      return [];
  }
};

export const getWithdrawOptions = (symbol: string): BridgeOption[] => {
  switch (symbol) {
    case 'CHR':
      return [
        {
          name: 'Economy Chain',
          url: `https://vault.chromia.com/en/transfer/?fromBrid=${BRIDGE_IDS.TO_BRID}&toBrid=${BRIDGE_IDS.FROM_BRID.ECONOMY_CHAIN}&token=${TOKEN_IDS.UDON.CHR}`,
        },
        {
          name: 'ColorPool DEX',
          url: `https://vault.chromia.com/en/transfer/?fromBrid=${BRIDGE_IDS.TO_BRID}&toBrid=${BRIDGE_IDS.FROM_BRID.COLORPOOL_DEX}&token=${TOKEN_IDS.UDON.CHR}`,
        },
      ];
    case 'D':
      return [
        {
          name: 'Token Chain',
          url: `https://vault.chromia.com/en/transfer/?fromBrid=${BRIDGE_IDS.TO_BRID}&toBrid=${BRIDGE_IDS.FROM_BRID.TOKEN_CHAIN}&token=${TOKEN_IDS.UDON.D}`,
        },
        {
          name: 'Mines of Dalarnia Chain',
          url: `https://vault.chromia.com/en/transfer/?fromBrid=${BRIDGE_IDS.TO_BRID}&toBrid=${BRIDGE_IDS.FROM_BRID.MINES_OF_DALARNIA}&token=${TOKEN_IDS.UDON.D}`,
        },
        {
          name: 'ColorPool DEX',
          url: `https://vault.chromia.com/en/transfer/?fromBrid=${BRIDGE_IDS.TO_BRID}&toBrid=${BRIDGE_IDS.FROM_BRID.COLORPOOL_DEX}&token=${TOKEN_IDS.UDON.D}`,
        },
      ];
    case 'ALICE':
      return [
        {
          name: 'Token Chain',
          url: `https://vault.chromia.com/en/transfer/?fromBrid=${BRIDGE_IDS.TO_BRID}&toBrid=${BRIDGE_IDS.FROM_BRID.TOKEN_CHAIN}&token=${TOKEN_IDS.UDON.ALICE}`,
        },
        {
          name: 'ColorPool DEX',
          url: `https://vault.chromia.com/en/transfer/?fromBrid=${BRIDGE_IDS.TO_BRID}&toBrid=${BRIDGE_IDS.FROM_BRID.COLORPOOL_DEX}&token=${TOKEN_IDS.UDON.ALICE}`,
        },
      ];
    default:
      return [];
  }
};
