import * as React from 'react';
import { getGreeting, setGreeting } from '../contracts/greeting-contract';

import EducationalText from './EducationalText';
import SignInPrompt from './SignInPrompt';
import SignOutButton from './SignOutButton';
import { useWalletSelector } from './WalletSelectorContext';

type Props = {
  contractName: string;
};

const ContractView = ({ contractName }: Props) => {
  const { selector, modal, accountId } = useWalletSelector();
  const [valueFromBlockchain, setValueFromBlockchain] = React.useState('');
  const [uiPleaseWait, setUiPleaseWait] = React.useState(true);

  const isSignedIn = accountId !== null;

  const handleSignOut = async () => {
    const wallet = await selector.wallet();

    try {
      await wallet.signOut();
    } catch (err) {
      console.log('Failed to sign out');
      console.error(err);
    }
  };

  React.useEffect(() => {
    if (selector) {
      getGreeting(selector, contractName)
        .then(setValueFromBlockchain)
        .catch(alert)
        .finally(() => {
          setUiPleaseWait(false);
        });
    }
  }, [selector, contractName]);

  const changeGreeting = (e: any) => {
    e.preventDefault();

    if (!accountId) {
      return;
    }

    setUiPleaseWait(true);
    const { greetingInput } = e.target.elements;

    setGreeting(selector, contractName, accountId, greetingInput.value)
      .then(() => getGreeting(selector, contractName))
      .then(setValueFromBlockchain)
      .finally(() => {
        setUiPleaseWait(false);
      });
  };

  if (!isSignedIn) {
    return <SignInPrompt greeting={valueFromBlockchain} onClick={() => modal?.show()} />;
  }

  return (
    <div className="relative bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10">
      <div className="mx-auto max-w-md">
        <div className="divide-y divide-gray-300/50">
          <div className="space-y-6 py-8 text-base leading-7 text-gray-600">
            {accountId ? (
              <div className="flex align-center justify-between gap-6">
                <p>
                  Hello <span className="font-medium">{accountId}</span>
                </p>
                <SignOutButton onClick={handleSignOut} />
              </div>
            ) : null}
            <h1 className="font-medium">
              The contract says: <span className="font-normal">{valueFromBlockchain}</span>
            </h1>
            <form onSubmit={changeGreeting} className="change">
              <label htmlFor="contrast-example" className="block text-sm font-medium text-slate-700 mb-4">
                Change greeting:
              </label>

              <div className="flex flex-row gap-6">
                <input
                  autoComplete="off"
                  defaultValue={valueFromBlockchain}
                  id="greetingInput"
                  className="px-3 py-2 bg-white border shadow-sm border-slate-200 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1 contrast-more:border-slate-400 contrast-more:placeholder-slate-500"
                />
                <button className="inline-flex align-center py-2 px-3 bg-sky-500 text-white text-sm font-semibold rounded-md shadow focus:outline-none">
                  {uiPleaseWait ? (
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <span>Save</span>
                  )}
                </button>
              </div>
            </form>
            <EducationalText />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractView;
