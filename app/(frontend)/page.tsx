import Image from "next/image"

import blinks from "public/images/background/first-block.png";
import section1 from "public/images/background/before-after.png";
import array from "public/images/background/crypto-in-twitter-sm.png";

const Landing = () => {
  return (
    <main>
      <section className='hero__section'>
        <section className='hero__text'>
          <h1 className="hero__text__h1 roboto-bold">The Future Of Social Media Monetization</h1>
          <p className="hero__text__p">You can now monetize your followers and engagements by creating a temporay bet pool around every trending topic and event</p>
        </section>
        <Image src={blinks} alt="blinks image" className="hero__image" />
      </section>
      <section className="main__section1">
        <div className="section1__text">
          <h1 className="section1__h1">Turn Your Engagements Into Real Money</h1>
          <p className="section1__p">With Betlify, you no longer have to wait for X ad revenue to make money.</p>
          <button className="section1__button">Try It Now</button>
        </div>
        <div className="section1__image__div">
          <Image src={section1} alt="section1 image" className="section1__image" />
        </div>
      </section>
      <section className="main__section2">
        <div className="section2__text">
          <h1 className="section2__h1" style={{color:'black'}}>A Pool For Every Trending Topic</h1>
          <p className="section2__p" style={{textAlign:'center', width:'80%'}}>Create a prediction market about the Latest TikTok dance challenge, Big tech innovations, the next 1000x memecoin, best anime movie of the year, winner of the Radar hackathon...</p>
        </div>
        <div className="section2__image">
          <Image src={array} className="array__image" alt="array of events"/>
          <Image src={array} className="array__image" alt="array of events"/>
        </div>
      </section>
    </main>
  )
}

export default Landing