import Image from "next/image";
import "./styles.css"
import betlify from "public/images/brand/logotrans.png";
import ConnectWalletButton from "solana/connectWalletButton";
import Link from "next/link";
import { Suspense } from "react";



export default function FronEndLayout({ children }){
    return(
        <div className="root__landing">
            <nav>
                <div>
                    <Link href="/">
                        <Image src={betlify} alt="betlify_logo" width={150} height={50} className="nav-logo" />
                    </Link>
                </div>
                <section className="nav__links">
                    <Link href="/dashboard" className="nav__button no-small">Get Started</Link>
                    <ConnectWalletButton />
                </section>
            </nav>
            <Suspense>
                {children}
            </Suspense>
        </div>
    )
}