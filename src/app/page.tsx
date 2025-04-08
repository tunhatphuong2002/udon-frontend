"use client";
import { publicClientConfig } from "@/utils/config/client";
import { useFtAccounts, useFtSession } from "@chromia/react";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected, address } = useAccount();
  const { data: ftAccounts } = useFtAccounts({ clientConfig: publicClientConfig });
  const { data: session } = useFtSession(
    ftAccounts?.length ? { clientConfig: publicClientConfig, account: ftAccounts[0] } : null,
  );

  return (
    <div>
      <h1>Udon</h1>
      <p>Is connected: {isConnected ? "Yes" : "No"}</p>
      <p>Address: {address}</p>
      <p>Session: {JSON.stringify(session)}</p>
      <p>FtAccounts: {JSON.stringify(ftAccounts)}</p>
      <p>Account id: {session?.account?.id.toString("hex")}</p>
    </div>
  );
}
