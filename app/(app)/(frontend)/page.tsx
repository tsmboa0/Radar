import Image from "next/image"

import blinks from "public/images/background/first-block.png";
import hero from "public/images/background/hero.png";
import section1 from "public/images/background/before-after.png";
import anime from "public/images/background/anime-new.jpg";
import meme from "public/images/background/meme.png";
import cod from "public/images/background/cod.png";
import sol from "public/images/background/sol.jpg";
import array from "public/images/background/crypto-in-twitter-sm.png";
import Link from "next/link";

const Landing = () => {
  return (
    <main>
      <section className='hero__section'>
        <section className='hero__text'>
          <h1 className="hero__text__h1 roboto-bold">The Future Of Social Media Monetization</h1>
          <p className="hero__text__p">You can now monetize your followers and engagements by creating a temporay bet pool around every trending topic and event</p>
        </section>
        <Image src={hero} alt="blinks image" className="hero__image" />
      </section>
      <section className="main__section1">
        <div className="section1__text">
          <h1 className="section1__h1">Turn Your Engagements Into Real Money</h1>
          <p className="section1__p">With Betlify, you no longer have to wait for X ad revenue to make money.</p>
            <Link href='/sign-in' style={{padding:'0.8rem'}} className="section1__button">Try It Now</Link>
        </div>
        <div className="section1__image__div">
          <Image src={cod} width={500} alt="section1 image" className="section1__image" />
        </div>
      </section>
      <section className="main__section2">
        <div className="section2__text">
          <h1 className="section2__h1" style={{color:'black'}}>A Pool For Every Trending Topic</h1>
          <p className="section2__p" style={{textAlign:'center', width:'100%'}}>Create a prediction market about the Latest TikTok dance challenge, Big tech innovations, the next 1000x memecoin, best anime movie of the year, winner of the Radar hackathon...</p>
        </div>
        <div className="section2__image">
          <Image src={meme} className="array__image" alt="array of events"/>
          <Image src={cod} className="array__image" alt="array of events"/>
          <Image src={anime} className="array__image" alt="array of events"/>
          <Image src={sol} className="array__image" alt="array of events"/>
        </div>
      </section>
      <section className="main__section1">
        <div className="section1__text">
          <h1 className="section1__h1">Earn More With Our Stake-2-Validate Program</h1>
          <p className="section1__p">Earn  fraction of our platform fees by verifying results accurately</p>
          <Link href='/validate' style={{padding:'0.8rem'}} className="section1__button">Verify Now</Link>
        </div>
        <div className="section1__image__div">
          <Image src={cod} width={500} alt="section1 image" className="section1__image" />
        </div>
      </section>
    </main>
  )
}

export default Landing