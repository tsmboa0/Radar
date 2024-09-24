// import theme style scss file

import WalletContextProvider from 'solana/walletContextProvider';
import Link from 'next/link';
import '../styles/theme.scss';

export const metadata = {
    title: 'Betlify | No-code decentralized bet pools creation platform',
    description: 'Betlify - Turn Your Social Media Followers And Engagement Into Instant Money Machine By Creating A Bet Pool Around Short-Lived Hype',
    keywords: 'Betlify, Betting, Decentralized, Pool Creation Platform, Social Media Montization'
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
