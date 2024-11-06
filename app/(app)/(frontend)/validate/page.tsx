"use client"

import Image from "next/image"
import Link from "next/link";

import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Check } from "react-bootstrap-icons";
import { setResult } from "app/api/server/blockchain/route";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";
import { getAllPools } from "app/api/server/database/route";

const Validate = () => {
    const wallet = useWallet();
    const {publicKey} = useWallet();
    const {connection} = useConnection();

    const validate = async(pda:string, option:number)=>{
        if(!publicKey) {alert("Connect your wallet first"); return};
        const pooldetail = pools.filter((pool)=> pool.pda == pda);
        console.log("pool details is: ",pooldetail);
        const title = pooldetail[0].poolTitle;
        const manager = pooldetail[0].manager;

        try{
            const response = await setResult(connection, wallet, title, manager, option);
        }catch(e){
            alert(`an error occured: ${e}`);
        }
    }

    const countdown = ()=>{

    }

    const [pools, setPools] = useState([{pda:"somerandonshittypda", manager:"somemangagerpubkey", poolTitle:"sometitle", desc:"some desc", option1:"option1", option2:"option2", endTime:17872527}]);
    const [isNull, setIsNull] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
        const getAllPool = async()=>{
            const response :any = await getAllPools();

            if(response !== null){
                const timeNow = Math.floor(new Date().getTime()/1000);
                const result = JSON.parse(response);
                const endedPools = [...result].filter((pool)=> (parseInt(pool.endTime)) < timeNow);

                setPools(endedPools);
                setIsLoading(false);  
            }else{
                console.log("pools is null")
                setPools([]);
                setIsLoading(false);
            }
        };
        getAllPool();
    }, []);

     
  return (
    <main>
      <section className='hero__section'>
        <section className='hero__text'>
          <h1 className="hero__text__h1 roboto-bold">Earn $Pool For Verifying Results Accurately!</h1>
          <p className="hero__text__p">You can earn a fraction of our platform fees by paticipating in our Stake-2-Validate program.</p>
        </section>
        {/* <Image src={hero} alt="blinks image" className="hero__image" /> */}
      </section>
      <section className="main__section2" style={{marginTop:'2rem'}}>
        <div className="section2__text">
          <h1 className="section2__h1" style={{color:'black'}}>How To Earn From Stake-2-Validate</h1>
          <section className="section2__p">
            <div> <Check size={30} color="green" /> <span>Browse through the list of ended events and click to view more details</span> </div>
            <div> <Check size={30} color="green"/> <span>Visit the result source page and gather all valuable information about the result of the event.</span></div>
            <div> <Check size={30} color="green"/> <span>Verify the result accurately by choosing the correct winner from the pool options</span></div>
          </section>
        </div>
      </section>
      <section className="verify__section">
        {!isLoading ? 
            pools.length ? 
            pools.map((pool, index)=> {return(
                <article className="verify__pool" key={index}>
                    <h1>{pool.poolTitle}</h1>
                    <div>
                        <p>{pool.desc}</p>
                        <p>Time Left to verify : <b> Xm Ys</b></p>
                        <p>Result Url: <Link href={`https://betlify.fun`}>https://x.com/betlifydotfun</Link></p>
                    </div>
                    <div className="verify__button">
                        <Button style={{backgroundColor:'black', border:'none'}} onClick={()=>validate(pool.pda, 1)} className="vb">{pool.option1}</Button>
                        <Button style={{backgroundColor:'black', border:'none'}} onClick={()=>validate(pool.pda, 2)} className="vb">{pool.option2}</Button>
                    </div>
                </article>
            )})
        : (
            <div>No Ended Pools currently</div>
        )
         : (
            <div>Loading pools...</div>
        )}
        
      </section>

    </main>
  )
}

export default Validate