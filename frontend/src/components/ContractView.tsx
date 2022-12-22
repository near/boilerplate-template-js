import * as React from 'react';

import EducationalText from './EducationalText';
import SignInPrompt from './SignInPrompt';
import SignOutButton from './SignOutButton';

import { useWalletSelector } from '../hooks/wallet-selector';

type Props = {
  contractName: string;
};

const ContractView = React.memo(({ contractName }: Props) => {
  const [valueFromBlockchain, setValueFromBlockchain] = React.useState();
  const [uiPleaseWait, setUiPleaseWait] = React.useState(true);

  const { selector, modal, accountId, signOut, viewMethod, callMethod } = useWalletSelector(contractName);
  const isSignedIn = React.useMemo(() => Boolean(selector?.isSignedIn()), [selector]);

  const getGreeting = React.useCallback(async () => {
    return await viewMethod(contractName, 'get_greeting');
  }, [contractName, viewMethod]);

  const setGreeting = async (greeting: string) => {
    return await callMethod(contractName, accountId, 'set_greeting', { message: greeting });
  };

  React.useEffect(() => {
    if (selector) {
      getGreeting()
        .then(setValueFromBlockchain)
        .catch(alert)
        .finally(() => {
          setUiPleaseWait(false);
        });
    }
  }, [getGreeting, selector]);

  const changeGreeting = (e) => {
    e.preventDefault();
    setUiPleaseWait(true);
    const { greetingInput } = e.target.elements;

    setGreeting(greetingInput.value)
      .then(() => getGreeting())
      .then(setValueFromBlockchain)
      .finally(() => {
        setUiPleaseWait(false);
      });
  };

  if (!isSignedIn) {
    return <SignInPrompt greeting={valueFromBlockchain} onClick={() => modal?.show()} />;
  }

  return (
    <>
      <SignOutButton accountId={accountId} onClick={() => signOut(contractName)} />
      <main className={uiPleaseWait ? 'please-wait' : ''}>
        <h1>
          The contract says: <span className="greeting">{valueFromBlockchain}</span>
        </h1>
        <form onSubmit={changeGreeting} className="change">
          <label>Change greeting:</label>
          <div>
            <input autoComplete="off" defaultValue={valueFromBlockchain} id="greetingInput" />
            <button>
              <span>Save</span>
              <div className="loader"></div>
            </button>
          </div>
        </form>
        <EducationalText />
      </main>
    </>
  );
});

export default ContractView;
