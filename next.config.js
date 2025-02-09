/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: false,

  env: {
    NETWORK_MODE: process.env.NETWORK_MODE || '',
    SUI_NETWORK_MODE: process.env.SUI_NETWORK_MODE || '',

    DAPP_SOCKET_URL: process.env.DAPP_SOCKET_URL,
    DAPP_SERVICE_URL: process.env.DAPP_SERVICE_URL,
    PRICE_FEED_SERVICE_URL: process.env.PRICE_FEED_SERVICE_URL,

    GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID,
    CHECK_HAS_NFT: process.env.CHECK_HAS_NFT || '',

    COLLECTION_ID: process.env.COLLECTION_ID || '',
    LIST_CREATOR_ADDRESS: process.env.LIST_CREATOR_ADDRESS || '',

    COLLECTION_BOOSTING_NFT_ID: process.env.COLLECTION_BOOSTING_NFT_ID || '',
    LIST_CREATOR_BOOTING_NFT_ADDRESS:
      process.env.LIST_CREATOR_BOOTING_NFT_ADDRESS || '',

    LIQUID: process.env.LIQUID || '',
    EXTREMELY_RISKY_HEALTH_RATIO:
      process.env.EXTREMELY_RISKY_HEALTH_RATIO || '',
    RISKY_HEALTH_RATIO: process.env.RISKY_HEALTH_RATIO || '',
    NORMAL_HEALTH_RATIO: process.env.NORMAL_HEALTH_RATIO || '',
    GOOD_HEALTH_RATIO: process.env.GOOD_HEALTH_RATIO || '',
    FLUCTUATIONS_MINT_COLLATERAL:
      process.env.FLUCTUATIONS_MINT_COLLATERAL || '0.01',
    // WORMHOLE_PROGRAM_ID: process.env.WORMHOLE_PROGRAM_ID || "",
    // WORMHOLE_STATE:  process.env.WORMHOLE_STATE || "",
    // WORMHOLE_EMITTER_CAP:  process.env.WORMHOLE_EMITTER_CAP || "",

    TOTAL_TOKEN_POINT_SYSTEM: process.env.TOTAL_TOKEN_POINT_SYSTEM || '',

    //SUI
    SUI_PACKAGE: process.env.SUI_PACKAGE || '',
    SUI_UPGRADED_PACKAGE: process.env.SUI_UPGRADED_PACKAGE || '',
    SUI_VERSION: process.env.SUI_VERSION || '',
    SUI_CONFIGURATION: process.env.SUI_CONFIGURATION || '',
    SUI_STATE: process.env.SUI_STATE || '',
    SUI_CUSTODIAN: process.env.SUI_CUSTODIAN || '',
    SUI_LEND_COIN_METADATA: process.env.SUI_LEND_COIN_METADATA || '',
    SUI_COLLATERAL_COIN_METADATA:
      process.env.SUI_COLLATERAL_COIN_METADATA || '',
    PYTH_STATE_ID: process.env.PYTH_STATE_ID || '',
    WORMHOLE_STATE_ID: process.env.WORMHOLE_STATE_ID || '',

    SUI_EARLY_CONTRIBUTOR_PACKAGE:
      process.env.SUI_EARLY_CONTRIBUTOR_PACKAGE || '',
    SUI_EARLY_CONTRIBUTOR_VERSION:
      process.env.SUI_EARLY_CONTRIBUTOR_VERSION || '',

    RPC_URL: process.env.RPC_URL || '',
  },

  async rewrites() {
    return [
      {
        source: '/dapp-service/:path*',
        destination: `${process.env.DAPP_SERVICE_URL}/:path*`,
      },
      {
        source: '/price-feed-service/:path*',
        destination: `${process.env.PRICE_FEED_SERVICE_URL}/:path*`,
      },
      {
        source: '/check-nft-service/:path*',
        destination: `${process.env.HELIUS_SERVICE_URL}/:path*?api-key=${process.env.HELIUS_API_KEY}`,
      },
    ];
  },
};

module.exports = nextConfig;
