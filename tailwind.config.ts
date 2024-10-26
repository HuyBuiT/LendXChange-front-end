import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      xs: '480px',
      sm: '641px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
    },
    extend: {
      colors: {
        black1: '#172123',
        blackBlur: 'rgba(0, 0, 0, 0.8)',

        neutral1: '#FFFFFF',
        neutral2: '#F9FAFB',
        neutral3: '#E5E7EB',
        neutral4: '#C4C9D3',
        neutral5: '#6B7280',

        primary1: '#EFF8FF',
        primary2: '#B2DDFF',
        primary3: '#84CAFF',
        primary4: '#53B1FD',
        primary5: '#2E90FA',
        primary6: '#1570EF',
        neutral7: '#374151',
        neutral8: '#1D2431',
        neutral9: '#3D3D3D',

        success1: '#B2E4C7',
        success2: '#66C61C',
        success3: '#16C367',
        success4: '#5AF2A1',

        purple1: '#F989FF',
        purple2: '#AF32C5',

        warning1: '#FFE58F',
        warning2: '#FAAD14',

        error1: '#FFA39E',
        error2: '#FF4D4F',

        brandTertiary: '#50E796',
        brandSecondary: '#25D8D3',
        brandDarkBlue: '#0F0A32',

        characterDown: '#F759AB',
        characterBackground1: '#0C111D',
        characterBackground2: '#1F242F',
        characterBackground3: '#171C27',
        characterUpcoming: '#294B86',

        orange1: '#F27C57',
      },
      backgroundImage: {
        bgTeleNotification:
          'linear-gradient(180deg, #0C425D 0%, #1F242F 41.5%)',
        bgTotalValueCardFluctuations:
          'linear-gradient(180deg, rgba(48, 252, 30, 0.32) 0%, transparent 100%);',
        bgTotalValueCardDefault:
          'linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, transparent 100%);',
        bgHeaderPopupReferral:
          'linear-gradient(180deg, rgba(175, 50, 197, 0.5) 0%, transparent 100%);',
        bgCurrentBalanceAffiliate:
          'linear-gradient(180deg, rgba(181, 52, 205, 0.5) 0%, transparent 100%);',

        bgButtonBootNotBought:
          'linear-gradient(0deg, rgba(146,146,146,1) 0%, rgba(89,89,89,0.6306897759103641) 100%);',
        bgButtonBootBought:
          'linear-gradient(0deg, rgba(184,48,204,1) 0%, rgba(158,90,215,0) 100%);',

        bgModalClaimReferralTop:
          'linear-gradient(180deg, rgba(95,40,105,1) 0%, rgba(95,40,105,1) 36%, transparent 100%);',

        bgModalClaimReferralBottom:
          'linear-gradient(180deg, transparent 0%, rgba(31,35,47,1) 56%, rgba(31,35,47,1) 100%)',
        bgGetBooted: 'linear-gradient(180deg, #692828 0%, transparent 100%);',
        bgReferFriends:
          'linear-gradient(180deg, rgba(107,253,254,0.4) 0%, transparent 100%);',

        borderNoCollaboratorDialog:
          'linear-gradient(180deg, rgba(181,52,205,1) 0%, rgba(31,36,47,1) 100%);',
        bgNoCollaboratorDialog:
          'linear-gradient(180deg, rgba(95,40,105,1) 0%, rgba(43,37,58,1) 40%, rgba(31,36,47,1) 100%)',

        bgPointSystem:
          'linear-gradient(180deg, rgba(95,40,105,1) 0%, rgba(31,36,47,1) 42%, rgba(31,36,47,1) 100%);',

        bgPointSystemButton:
          'radial-gradient(282.59% 1600.57% at -104.22% 90.93%, #A42020 0%, #DB6320 100%) ',

        bgDailyPoint:
          'linear-gradient(90deg, rgba(18,29,50,1) 0%, rgba(11,14,20,1) 100%)',

        joinSeasonButton:
          'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 100%);',
      },
      fontFamily: {
        inter: ['var(--font-inter)', 'sans-serif'],
        fugazOne: ['var(--font-fugaz-one)', 'sans-serif'],
      },

      boxShadow: {
        pointSystem: '0px 5.01px 55.16px 0px #F25959A6',
      },
      keyframes: {
        popUp: {
          from: {
            opacity: '0',
            transform: 'translate(-50%, -48%) scale(0.96)',
          },
          to: {
            opacity: '1',
            transform: 'translate(-50%, -50%) scale(1)',
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
