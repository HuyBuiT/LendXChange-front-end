import i18next from 'i18next';
import enLang from './resources/en';
import { FormatUtils } from '@/utils';
import { initReactI18next } from 'react-i18next';
import { LangConstant, AppConstant } from '@/const';

i18next.use(initReactI18next).init(
  {
    resources: {
      en: enLang,
    },
    lng: LangConstant.DEFAULT_LANG_CODE,
    fallbackLng: LangConstant.DEFAULT_LANG_CODE,
    defaultNS: LangConstant.NS_COMMON,
    fallbackNS: LangConstant.NS_COMMON,
    react: { useSuspense: false },
    interpolation: {
      // React already does escaping
      escapeValue: false,

      format: (value, format) => {
        if (value === undefined || value === null) {
          return AppConstant.NOT_HAVE_VALUE_LABEL;
        }
        switch (format) {
          case 'number':
            return FormatUtils.formatNumber(value);
          default:
            return value;
        }
      },
    },
  },
  (err) => {
    if (err) {
      return console.error(err);
    }
  },
);

i18next.on('missingKey', (_, namespace, key) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(
      `Cannot find the "${key}" key in the "${namespace}" namespace`,
    );
  }
});

export default i18next;

export const getLabel = (key: string, otp = {}) =>
  i18next.getFixedT(i18next.language)(key, otp);

export const getLabelWithNS = (ns: string, key: string, otp = {}) =>
  i18next.getFixedT(i18next.language, ns)(key, otp);
