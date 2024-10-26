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
    HELIUS_SERVICE_URL: process.env.HELIUS_SERVICE_URL,

    ECLIPSE_RPC_URL: process.env.ECLIPSE_RPC_URL,
    ECLIPSE_WS_RPC_URL: process.env.ECLIPSE_WS_RPC_URL,
    ECLIPSE_PROGRAM_ID: process.env.ECLIPSE_PROGRAM_ID,
    ECLIPSE_HOT_WALLET: process.env.ECLIPSE_HOT_WALLET,

    GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID,

    SOL_PROGRAM_ID: process.env.SOL_PROGRAM_ID || '',
    SOL_HOT_WALLET: process.env.SOL_HOT_WALLET || '',
    HELIUS_API_KEY: process.env.HELIUS_API_KEY || '',
    CHECK_HAS_NFT: process.env.CHECK_HAS_NFT || '',
    TELEGRAM_BOT_NAME: process.env.TELEGRAM_BOT_NAME || '',
    SOL_PROGRAM_ID: process.env.SOL_PROGRAM_ID || '',
    SOL_HOT_WALLET: process.env.SOL_HOT_WALLET || '',
    HELIUS_API_KEY: process.env.HELIUS_API_KEY || '',
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


    SUI_MOVEMENT_PACKAGE: process.env.SUI_MOVEMENT_PACKAGE || '',
    SUI_MOVEMENT_UPGRADED_PACKAGE:
      process.env.SUI_MOVEMENT_UPGRADED_PACKAGE || '',
    SUI_MOVEMENT_VERSION: process.env.SUI_MOVEMENT_VERSION || '',
    SUI_MOVEMENT_CONFIGURATION: process.env.SUI_MOVEMENT_CONFIGURATION || '',
    SUI_MOVEMENT_STATE: process.env.SUI_MOVEMENT_STATE || '',
    SUI_MOVEMENT_CUSTODIAN: process.env.SUI_MOVEMENT_CUSTODIAN || '',

    SUI_MOVEMENT_COLLATERAL_COIN_METADATA:
      process.env.SUI_MOVEMENT_COLLATERAL_COIN_METADATA || '',
    SUI_MOVEMENT_LEND_COIN_METADATA:
      process.env.SUI_MOVEMENT_LEND_COIN_METADATA || '',
    PYTH_STATE: process.env.PYTH_STATE || '',
    SUI_MOVEMENT_PYTH_COLLATERAL:
      process.env.SUI_MOVEMENT_PYTH_COLLATERAL || '',
    SUI_MOVEMENT_PYTH_LENDING: process.env.SUI_MOVEMENT_PYTH_LENDING || '',
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

    APTOS_MOVEMENT_PACKAGE: process.env.APTOS_MOVEMENT_PACKAGE || "",
    APTOS_MOVEMENT_RPC_URL: process.env.APTOS_MOVEMENT_RPC_URL || "",
    APTOS_MOVEMENT_INDEXER_RPC_URL: process.env.APTOS_MOVEMENT_INDEXER_RPC_URL || "",
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
