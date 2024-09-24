"use client"

import {ConnectionProvider, WalletProvider} from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { useMemo } from "react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";

require('@solana/wallet-adapter-react-ui/styles.css');

const WalletContextProvider = ({ children, }: {children: React.ReactNode})=>{
    const network = WalletAdapterNetwork.Devnet
    const endpoint = useMemo(()=>clusterApiUrl(network), [network]);

    const wallets = useMemo(()=>[
        // PhantomWalletAdapter
    ], [network]);

    return(
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={[]} autoConnect={true}>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}

export default WalletContextProvider;