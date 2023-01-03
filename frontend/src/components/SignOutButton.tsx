import * as React from 'react';

type Props = {
  accountId: string;
  onClick: React.MouseEventHandler;
};

const SignOutButton = React.memo(({ accountId, onClick }: Props) => {
  return (
    <button style={{ float: 'right' }} onClick={onClick}>
      Sign out {accountId}
    </button>
  );
});

export default SignOutButton;
