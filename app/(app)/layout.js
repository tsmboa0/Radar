// import theme style scss file

import WalletContextProvider from 'solana/walletContextProvider';
import Link from 'next/link';
import '/styles/theme.scss';

export const metadata = {
    title: "Betlify |Solana's First No-code Prediction Market Builder",
    description: 'Betlify - Turn Your Social Media Followers And Engagement Into Instant Money Machine By Creating A Bet Pool Around Every Hype',
    keywords: 'Betlify, Betting, Decentralized,No-Code Prediction Market Builder, Solana, Pool Creation Platform, Social Media Montization'
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <WalletContextProvider>
                <body className='bg-light'>
                    {children}
                </body>
            </WalletContextProvider>
        </html>
    )
}
