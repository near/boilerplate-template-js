import { WalletSelector } from '@near-wallet-selector/core';
import { callMethod, viewMethod } from './contract';

export const getGreeting = async (walletSelector: WalletSelector, contractId: string) => {
  return viewMethod(walletSelector, {
    contractId,
    method: 'get_greeting',
    args: {},
  });
};

export const setGreeting = async (
  walletSelector: WalletSelector,
  contractId: string,
  accountId: string,
  message: string,
) => {
  await callMethod(walletSelector, accountId, {
    contractId,
    method: 'set_greeting',
    args: { message },
  });
};
