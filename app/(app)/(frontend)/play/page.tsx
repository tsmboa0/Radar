"use client"

import { getPoolDetails } from 'app/api/server/database/route';
import { PlaceBet } from 'app/api/server/blockchain/route';
import "../styles.css";

import Image from 'next/image'
import betlify from "public/images/brand/betlifyiconbg.jpg";
import avatar from "public/images/avatar/avatar-2.jpg";
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';

import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { claimWinnings } from 'app/api/server/blockchain/route';
import { useSearchParams } from 'next/navigation';

const Play = () => {
    const params = useSearchParams();
    
    const id = params.get("id");
    console.log("the pool id is: ",id);

    const [poolDetails, setPoolDetails] = useState({poolTitle: "Post Title", result:1, endTime:1783526, manager:"manger", pda:"pda", desc:"Pool Description", option1:"option1", option2:"option2", uploadUrl:betlify, minBetAmount:0.01});
    const [pda, setPda] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [betAmount, setBetAmount] = useState("");

    const wallet = useWallet();
    const {publicKey} = useWallet();
    const {connection} = useConnection();

    useEffect(()=>{
        if(!id) return;
        
        const _pda = id as string;
        const data = new FormData();
        data.append("pda", _pda);

        const _getPoolDetails = async()=>{
            const result : any = await getPoolDetails(data);
            console.log("the pool title is: ",(JSON.parse(result)).poolTitle);
            console.log("the pda is: ",(JSON.parse(result)).pda);

            setPoolDetails(JSON.parse(result));
            setPda((JSON.parse(result)).pda);
            setIsLoading(false);
        }

        _getPoolDetails();
    }, []);

    const Bet = async(option:number)=>{
        if (!publicKey) {
            alert("Please connect your wallet first");
            // return;
        }

        try{
            console.log("calling place bet");
            const result = await PlaceBet(connection, wallet, poolDetails.poolTitle, poolDetails.manager, poolDetails.pda, parseFloat(betAmount)*LAMPORTS_PER_SOL, option);
            if (result.success){
                alert(result.message);
            }else{
                alert(result.message);
            }
        }catch(e){
            console.log("failed");
        }
    }

    const Claim = async()=>{
        if (!publicKey) {
            alert("Please connect your wallet first");
            return;
        }
        if (poolDetails.result != 0 && poolDetails.result != 1) {
            alert("result not set... please check back later");
            return;
        };
        console.log("Starting claim...")

        const response = await claimWinnings(connection, wallet, poolDetails.poolTitle, poolDetails.manager, poolDetails.pda);
        console.log(response.message);
    }


  return (
    <main className='main__play'>
        {isLoading? (
            <div>Loading...</div>
        ): (parseInt((poolDetails.endTime).toString())*1000) < (Math.floor(new Date().getTime())) ? (
            //when end time has been passed
            (
                <section className='play__section'>
                    <div className='play__image'>
                        <Image src={poolDetails.uploadUrl} width={500} height={281} className='play__image' alt="Pool Image" />
                    </div>
                    <div className='play__title'>
                        <h1>{poolDetails.poolTitle}</h1>
                    </div>
                    <div className='play__desc'>
                        <h4>{poolDetails.desc}</h4>
                    </div>
                    <div className='play__desc'>
                        <h3>Result : {poolDetails.result == 1 ? poolDetails.option1 : poolDetails.result == 2 ? poolDetails.option2 : "Not Set"}</h3>
                    </div>
                    <div className='play__options'>
                        <Button onClick={Claim} style={{backgroundColor:'black', border:'none'}}>Claim Winnings</Button>
                    </div>
                </section>
            )
        ) : (
            //endTime not met
            (
                <section className='play__section'>
                    <div className='play__image'>
                        <Image src={poolDetails.uploadUrl} width={500} height={281} className='play__image' alt="Pool Image" />
                    </div>
                    <div className='play__title'>
                        <h1>{poolDetails.poolTitle}</h1>
                    </div>
                    <div className='play__desc'>
                        <h4>{poolDetails.desc}</h4>
                    </div>
                    <div>
                        <label htmlFor='betAmount'>Bet Amount </label>
                        <input type='number' className='play__betAmount' onChange={(e)=>setBetAmount(e.target.value)} value={betAmount} name='betAmount' placeholder={`Enter Bet Amount min of 0.1 SOL`} />
                    </div>
                    <div className='play__options'>
                        <Button style={{backgroundColor:'black', border:'none'}} onClick={()=>Bet(1)}>Bet on {poolDetails.option1}</Button>
                        <Button style={{backgroundColor:'black', border:'none'}} onClick={()=>Bet(0)}>Bet on {poolDetails.option2}</Button>
                    </div>
                </section>
            )
        )
        }
    </main>
  )
}

export default Play