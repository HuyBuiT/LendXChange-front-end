import React, { FC } from 'react';

import {
  useWallet,
  WalletItem,
  AnyAptosWallet,
  isInstallRequired,
  groupAndSortWallets,
} from '@aptos-labs/wallet-adapter-react';
import { twJoin } from 'tailwind-merge';

const AptosWalletList: FC<AptosWalletListProps> = ({ onClose }) => {
  const { wallets = [] } = useWallet();
  const { availableWallets } = groupAndSortWallets(wallets);

  return (
    <div className={twJoin('w-full', 'flex flex-col gap-y-4')}>
      {availableWallets
        .filter((item) => item.name !== 'Dev T wallet')
        .map((wallet) => (
          <WalletRow key={wallet.name} wallet={wallet} onConnect={onClose} />
        ))}
    </div>
  );
};

export default AptosWalletList;

interface AptosWalletListProps {
  onClose: () => void;
}

function WalletRow({ wallet, onConnect }: WalletRowProps) {
  return (
    <WalletItem wallet={wallet} onConnect={onConnect}>
      {!isInstallRequired(wallet) && (
        <WalletItem.ConnectButton
          asChild
          className={twJoin(
            'px-4 py-2',
            'rounded-lg',
            'cursor-pointer',
            'text-sm text-neutral1 font-medium',
            'border border-characterBackground2',
            'flex flex-row items-center gap-x-2',
            'bg-characterBackground2 hover:bg-characterBackground3',
          )}
        >
          <div>
            <WalletItem.Icon className="h-10 w-10" />
            <WalletItem.Name />
          </div>
        </WalletItem.ConnectButton>
      )}
    </WalletItem>
  );
}

interface WalletRowProps {
  wallet: AnyAptosWallet;
  onConnect?: () => void;
}
