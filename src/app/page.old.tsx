'use client';
import { publicClientConfig } from '@/configs/client';
import { useFtAccounts, useFtSession } from '@chromia/react';
import { useAccount, useDisconnect } from 'wagmi';

export default function Home() {
  const { isConnected, address } = useAccount();
  const { data: ftAccounts } = useFtAccounts({ clientConfig: publicClientConfig });
  const { data: session } = useFtSession(
    ftAccounts?.length ? { clientConfig: publicClientConfig, account: ftAccounts[0] } : null
  );
  const { disconnect } = useDisconnect();

  return (
    <div>
      <h1>Udon</h1>
      <p>Is connected: {isConnected ? 'Yes' : 'No'}</p>
      <p>Address: {address}</p>
      <p>Session: {JSON.stringify(session)}</p>
      <p>FtAccounts: {JSON.stringify(ftAccounts)}</p>
      <p>Account id: {session?.account?.id.toString('hex')}</p>
      <button onClick={() => disconnect()} className="bg-red-500 text-white p-2 rounded-md">
        Disconnect
      </button>
    </div>
  );
}
