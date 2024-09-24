"use client"


import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const ConnectWalletButton = ()=>{
    const { publicKey } = useWallet();

    return(
        <div>
            <WalletMultiButton style={{backgroundColor:'black', padding:'0.7rem', borderRadius:'0.5rem'}}>{publicKey? (publicKey).toString().substring(0,4)+'...'+(publicKey).toString().substring(40,44): 'Connect Wallet'}</WalletMultiButton>
        </div>
    )
}

export default ConnectWalletButton;