"use client"

import { getPoolDetails } from 'app/api/server/database/route';
import { onchainPoolDetails } from 'app/api/server/blockchain/route';
import { PlaceBet } from 'app/api/server/blockchain/route';
import { sellPosition } from 'app/api/server/blockchain/route';
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

    const [poolDetails, setPoolDetails] = useState({poolTitle: "Post Title", result:1,lockTime:1787265359, endTime:1783526, manager:"manger", pda:"pda", desc:"Pool Description", option1:"option1", option2:"option2", uploadUrl:betlify, minBetAmount:0.01});
    const [pda, setPda] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [betAmount, setBetAmount] = useState("");
    const [onChainDetails, setOnchainDetails] = useState({yes:0.5, no:0.5});
    const [isExecuting, setIsExecuting] = useState(false);

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

            const onchain = await onchainPoolDetails(connection, wallet, _pda);
            const resultOnchain = JSON.parse(onchain);
            const noOfTrue = BigInt(`0x${resultOnchain.noOfTrue}`);
            const noOfFalse = BigInt(`0x${resultOnchain.noOfFalse}`);
            console.log("number of true is on chain: ",noOfTrue);
            const total = noOfTrue + noOfFalse;
            const yesOdds = Number(BigInt(10000) * noOfTrue / total) / 10000;
            const noOdds = Number(BigInt(10000) * noOfFalse / total) / 10000;

            console.log("number of true odd is on chain: ",yesOdds);

            setOnchainDetails({yes:yesOdds, no:noOdds});

            setPoolDetails(JSON.parse(result));
            setPda((JSON.parse(result)).pda);
            setIsLoading(false);
        }

        _getPoolDetails();
    }, []);

    const Bet = async(option:number)=>{
        if (!publicKey) {
            alert("Please connect your wallet first");
            return;
        }

        if(betAmount=="") {
            alert("Invalid Amount");
            return
        }

        setIsExecuting(true);

        try{
            console.log("calling place bet");
            const result = await PlaceBet(connection, wallet, poolDetails.poolTitle, poolDetails.manager, poolDetails.pda, parseFloat(betAmount)*LAMPORTS_PER_SOL, option);
            if (result.success){
                alert(result.message);
                setIsExecuting(false);
                setBetAmount("");
            }else{
                alert(result.message);
                setIsExecuting(false);
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
        console.log("Starting claim...");

        setIsExecuting(true);

        const response = await claimWinnings(connection, wallet, poolDetails.poolTitle, poolDetails.manager, poolDetails.pda);
        console.log(response.message);
        setIsExecuting(false);
    }
    const Sell = async(position:number)=>{
        if (!publicKey) {
            alert("Please connect your wallet first");
            return;
        }
        if ((parseInt((poolDetails.lockTime).toString())*1000) < (Math.floor(new Date().getTime()))) {
            alert("Reverted... Event already started or Pool already locked");
            return;
        };
        console.log("Starting sell...");

        setIsExecuting(true);

        const response = await sellPosition(connection, wallet, poolDetails.poolTitle, poolDetails.manager, poolDetails.pda, position);
        console.log(response.message);
        setIsExecuting(false);
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
                        <h2>{poolDetails.poolTitle}</h2>
                    </div>
                    <div className='play__desc'>
                        <h5>{poolDetails.desc}</h5>
                    </div>
                    {isExecuting ? (
                        <Button style={{display:'block', width:'100%', backgroundColor:'black', border:'none'}}>Executing...</Button>
                    ) : (
                        <div>
                            <div>
                                <label htmlFor='betAmount'>Buy Amount </label>
                                <input type='number' className='play__betAmount' onChange={(e)=>setBetAmount(e.target.value)} value={betAmount} name='betAmount' placeholder={`Enter Buy Amount`} />
                            </div>
                            <div className='verify__button' style={{marginBottom:'0.5rem'}}>
                                <Button className='vb' style={{backgroundColor:'black', border:'none'}} onClick={()=>Bet(1)}>Buy {poolDetails.option1} ( ${onChainDetails.yes} ) </Button>
                                <Button className='vb' style={{backgroundColor:'black', border:'none'}} onClick={()=>Bet(2)}>Buy {poolDetails.option2} ( ${onChainDetails.no} )</Button>
                            </div>
                            <div className='verify__button'>
                                <Button className='vb' style={{backgroundColor:'black', border:'none'}} onClick={()=>Sell(1)}> Sell All {poolDetails.option1}</Button>
                                <Button className='vb' style={{backgroundColor:'black', border:'none'}} onClick={()=>Sell(2)}>Sell All {poolDetails.option2}</Button>
                            </div>
                        </div>
                    )}
                </section>
            )
        )
        }
    </main>
  )
}

export default Play