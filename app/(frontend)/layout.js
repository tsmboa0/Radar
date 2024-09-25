import Image from "next/image";
import "./styles.css"
import betlify from "public/images/brand/betlifyiconbg.jpg"
import ConnectWalletButton from "solana/connectWalletButton";
import Link from "next/link";
import { Suspense } from "react";



export default function FronEndLayout({ children }){
    return(
        <div className="root__landing">
            <nav>
                <div>
                    <Image src={betlify} alt="betlify_logo" width={30} height={30} />
                </div>
                <section className="nav__links">
                    <button className="nav__button">Get Started</button>
                    <ConnectWalletButton />
                </section>
            </nav>
            <Suspense>
                {children}
            </Suspense>
        </div>
    )
}