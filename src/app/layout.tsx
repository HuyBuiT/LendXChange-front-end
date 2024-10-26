import { cookies } from 'next/headers';
import { Inter, Fugaz_One } from 'next/font/google';

import { twJoin } from 'tailwind-merge';

import { ApiConstant, AppConstant } from '@/const';
import { MainLayoutHeader } from '@/components/layout/main-layout';

import {
  SuiProvider,
  AppProvider,
  AuthProvider,
  HomeProvider,
  LoanProvider,
  LendProvider,
  ErrorProvider,
  SocketProvider,
  MovementAptosProvider,
} from '@/context';

import '@mysten/dapp-kit/dist/index.css';
import './overrideWalletDialog.css';
import './globals.css';
import { GoogleAnalytics } from '@/components/common';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const fugazOne = Fugaz_One({
  subsets: ['latin'],
  variable: '--font-fugaz-one',
  weight: '400',
});

const getAccessToken = () => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get(AppConstant.KEY_TOKEN);

  return accessToken?.value || '';
};

export default async function RootLayout({ children }: RootLayoutProps) {
  const accessToken = await getAccessToken();

  return (
    <html lang="en">
      <GoogleAnalytics />
      <body id="body" className={twJoin(inter.variable, fugazOne.variable)}>
        <AppProvider
          campaignData={[]}
        >
          <SuiProvider>
            <MovementAptosProvider>
              <AuthProvider accessToken={accessToken}>
                <ErrorProvider>
                  <HomeProvider>
                    <LendProvider>
                      <LoanProvider>
                            <SocketProvider>
                              <MainLayoutHeader />
                              <div
                                className={twJoin(
                                  'font-inter',
                                  'flex justify-center',
                                  'min-h-[calc(100svh-64px)]',
                                  'relative w-screen mt-16',
                                )}
                              >
                                <div
                                  className={twJoin(
                                    'w-full h-full',
                                    'px-0 sm:px-6 lg:px-0',
                                    'max-w-full	lg:max-w-[920px]',
                                  )}
                                >
                                  {children}
                                </div>
                              </div>
                            </SocketProvider>
                      </LoanProvider>
                    </LendProvider>
                  </HomeProvider>
                </ErrorProvider>
              </AuthProvider>
            </MovementAptosProvider>
          </SuiProvider>
        </AppProvider>
      </body>
    </html>
  );
}

interface RootLayoutProps {
  children: React.ReactNode;
}

declare global {
  interface Window {
    backpack?: any;
    phantom?: {
      solana: any;
    };
    solflare?: any;
    bitkeep?: {
      solana: any;
    };
    salmon?: any;
  }
}
