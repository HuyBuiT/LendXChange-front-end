import { NetworkModeEnum } from '@/models';
import { Network } from '@aptos-labs/ts-sdk';

export const KEY_TOKEN = 'token';
export const KEY_CHAIN = 'chain';
export const COOKIE_EXPIRED_DATE = 7;
export const KEY_API_RESPONSE = 'api-response';
export const KEY_OPEN_POINT_DRAWER = 'is-open-point-drawer';

export const NOT_HAVE_VALUE_LABEL = '- -';
export const NOT_AVAILABLE_VALUE = 'N/A';

export const DEBOUNCE_TIME_IN_MILLISECOND = 500;

export const SIZE_PAGINATION_DEFAULT = 5;
export const DEFAULT_PAGINATION = {
  page: 1,
  size: SIZE_PAGINATION_DEFAULT,
};
export const SORT_DIRECTION = {
  asc: 1,
  desc: -1,
};

export const BREAK_POINTS = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1440,
};

export const USD_FORMAT = {
  style: 'currency',
  currency: 'USD',
};

export const APTOS_MOVEMENT_NETWORK_CONFIG =
  process.env.NETWORK_MODE === NetworkModeEnum.MAIN_NET
    ? Network.MAINNET
    : process.env.NETWORK_MODE === NetworkModeEnum.TEST_NET
      ? Network.TESTNET
      : Network.DEVNET;

export const USER_REJECTED_MESSAGE = 'User Rejected';

export const SOLANA_PROVIDER = 'solana-provider';

export const INIT_PRICE_FEED = new Map();
export const INIT_BALANCES = new Map();
export const INIT_PRICE_FEED_SUI_MOVEMENT = [0, 0, 0];
export const INIT_BALANCES_SUI_MOVEMENT = [0, 0, 0]; // USDC_WBTC_WETH
export const INIT_PRICE_FEED_SUI = [0, 0];
export const INIT_BALANCES_SUI = [0, 0]; //USDC_SUI

export const DISPLAY_ACTIVE_LOAN_BEST_OFFER = 5;

export const TOP_EARNED_REWARD = 100;

export const MAX_ALLOWED_INTEREST = 200;

export const EARLY_CONTRIBUTOR_BOOSTED_RATE = 1.4;
export const BOOSTING_PASS_BOOSTED_RATE = 1.2;

export const APTOS_MOVEMENT_COIN_STORE = '0x1::coin::CoinStore';
export const APTOS_MOVEMENT_COIN_TYPE = '0x1::aptos_coin::AptosCoin';

export const META_DATA_HOME_DEFAULT = {
  title: 'Welcome to EnsoFi: Lend & Borrow with Certainty',
  description:
    'Welcome to EnsoFi. Explore how EnsoFi revolutionizes lending and borrowing with fixed interest rates across any blockchain',
  url: process.env.NEXT_PUBLIC_DDAP_URL,
  siteName: 'Ensofi',
  urlImage:
    'https://prd-ensofi-public-992382835581.s3.ap-southeast-1.amazonaws.com/Blink/Resource+page.png',
};

export const META_DATA_LEND_DEFAULT = {
  title:
    'Lend with EnsoFi: Fixed Interest Rates and Seamless Multi-Chain Transactions',
  description:
    'Empower your financial growth by lending your assets on EnsoFi. Enjoy fixed interest rates and seamless transactions across multiple chains, all from one platform',
  url: `${process.env.NEXT_PUBLIC_DDAP_URL}/lend`,
  siteName: 'Ensofi',
  urlImage:
    'https://prd-ensofi-public-992382835581.s3.ap-southeast-1.amazonaws.com/Blink/Resource+page.png',
};

export const META_DATA_LOAN_DEFAULT = {
  title:
    'Lend with EnsoFi: Fixed Interest Rates and Seamless Multi-Chain Transactions',
  description:
    'Empower your financial growth by lending your assets on EnsoFi. Enjoy fixed interest rates and seamless transactions across multiple chains, all from one platform',
  url: `${process.env.NEXT_PUBLIC_DDAP_URL}/lend`,
  siteName: 'Ensofi',
  urlImage:
    'https://prd-ensofi-public-992382835581.s3.ap-southeast-1.amazonaws.com/Blink/Resource+page.png',
};

export const META_DATA_REWARD_SYSTEM_DEFAULT = {
  title:
    'Lend with EnsoFi: Fixed Interest Rates and Seamless Multi-Chain Transactions',
  description:
    'Empower your financial growth by lending your assets on EnsoFi. Enjoy fixed interest rates and seamless transactions across multiple chains, all from one platform',
  url: `${process.env.NEXT_PUBLIC_DDAP_URL}/lend`,
  siteName: 'Ensofi',
  urlImage:
    'https://prd-ensofi-public-992382835581.s3.ap-southeast-1.amazonaws.com/Blink/Resource+page.png',
};

export const TEXT_SHARE_CURRENT_POINT = `🚀 Just snagged my $ENS Reward from @ensofi_xyz! 🌟\n
Want yours? Head over to __url__ and claim it today! 💰✨\n\n`;
export const KAMINO_MAIN_MARKET_ADDRESS =
  '7u3HeHxYDLhnCoErrtycNokbQYbWGzLs6JSDqGAv5PfF';

export const SUI_NFT_BETA_CHECK_COIN_TYPE =
  '0x88adc865abcdf01157753e67bcb6199b0aacf13131e83f38fc887ca35667bcd7::early_contributor_pass::EarlyContributorPass';

export const SUI_NFT_EARLY_CONTRIBUTOR_COIN_TYPE = `${process.env.SUI_EARLY_CONTRIBUTOR_PACKAGE}::early_contributor_pass::EarlyContributorPass`;

export const ActiveNetwork = {
  SOLANA: false,
  SUI: true,
  SUI_MOVEMENT: false,
  APTOS_MOVEMENT: false,
  ECLIPSE: false,
};

export const TITLE_SHARE_REFER_CODE = `Lend and borrow with fixed interest rate? @Ensofi_xyz offers just that, giving you the certainty you need! \n\nSeason 2 Reward is here with 2,000,000 $ENS and exciting benefits to reward users for productive usage.\n\n`;

export const PERSONAL_KIOSK_PACKAGE =
  '0x0cb4bcc0560340eb1a1b929cabe56b33fc6449820ec8c1980d69bb98b649b802';
export const KIOSK_TAKE_FUNC = '0x2::kiosk::take';
