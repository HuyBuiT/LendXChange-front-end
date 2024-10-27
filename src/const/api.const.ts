export const HEADER_DEFAULT = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': '69420',
};

export const BASE_SOURCE = '/dapp-service/';
export const PRICE_FEED_SOURCE = '/price-feed-service/';
export const CHECK_NFT_SOURCE = '/check-nft-service';

export const TIMEOUT = 30000;

// HTTP Status
export const STT_OK = 200;
export const STT_CREATED = 201;
export const STT_BAD_REQUEST = 400;
export const STT_UNAUTHORIZED = 401;
export const STT_FORBIDDEN = 403;
export const STT_NOT_FOUND = 404;
export const STT_INTERNAL_SERVER = 500;
export const STT_NOT_MODIFIED = 304;

// API Path

// Account Api
export const GET_ACCOUNT_INFO = '/account/info';
export const ACCOUNT_SETTING = '/account/setting';

// Authentication APIs
export const AUTH = '/auth';

export const GET_NONCE = `${AUTH}/wallet/{walletAddress}/nonce`;
export const POST_LOGIN = `${AUTH}/{network}/login`;
export const POST_LOGOUT = `${AUTH}/logout`;

export const SYNC_TRANSACTION = '/sync-transaction';

// Offer APIs
export const OFFERS = '/offers';
export const GET_OFFER_TEMPLATES = `${OFFERS}/SUI/templates`;

// Price feed APIs
export const GET_LATEST_PRICE_FEEDS = '/latest_price_feeds';

// Lend APIs
export const GET_LEND_OFFERS = '/offers';
export const GET_LEND_OFFERS_DASHBOARD = `${GET_LEND_OFFERS}/dashboard`;
export const GET_BEST_OFFERS = `${GET_LEND_OFFERS}/best-offers`;

// Loan APIs
export const GET_CONTRACT = '/loans';
export const GET_LOANS_DASHBOARD = `${GET_CONTRACT}/dashboard`;
export const GET_ACTIVE_LOANS = `${GET_CONTRACT}/active-loans`;

export const NOTIFICATION_SETTING = '/notification-setting';
export const NOTIFICATION_HISTORY = '/notification-history';
export const SEEN_NOTIFICATION_HISTORY = `${NOTIFICATION_HISTORY}/seen`;
export const UNSEEN_COUNT_NOTIFICATION_HISTORY = `${NOTIFICATION_HISTORY}/unseen/count`;

// referral
export const GET_REFER_ACCOUNT = '/account/refer';
export const POST_REFER_ACCOUNT = '/account/refer/submit';
export const GET_DAILY_POINT_AVAILABILITY =
  '/point-system/daily-point/availability';
export const POST_DAILY_POINT = '/point-system/daily-point';
export const GET_EARNED_REWARD = '/point-system/earned-reward';
export const GET_EARNED_REWARD_STATISTIC = `${GET_EARNED_REWARD}/statistic`;
export const GET_USER_BOOSTED_ACTIVE = '/point-system/user-boosted/active';
export const CREATE_BURN = '/mint/create_burn';
export const SYNC_BURNED = '/mint/sync_burned';
export const GET_TOP_EARNED_REWARD = '/point-system/earned-reward/top';
export const GET_CREATE_USER_REWARD = '/image/create-user-reward';
export const GET_CAMPAIGN_DETAIL = '/campaign/campaign';

// Assets
export const ASSETS = '/assets';
// other
export const NAVI_PROTOCOL_URL =
  'https://api-defi.naviprotocol.io/getIndexAssetData';
