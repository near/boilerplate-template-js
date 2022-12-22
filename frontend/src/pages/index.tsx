import Head from 'next/head';

import * as React from 'react';

import { NextPage } from 'next';

import ContractView from '../components/ContractView';

type Props = {
  contractName: string;
};

const App: NextPage = React.memo(({ contractName }: Props) => {
  return (
    <>
      <Head>
        <title>Welcome to NEAR with React Boilerplate Template!</title>
      </Head>
      <ContractView contractName={contractName} />
    </>
  );
});

App.getInitialProps = async () => {
  const contractName = process.env.CONTRACT_NAME;
  return { contractName };
};

export default App;
