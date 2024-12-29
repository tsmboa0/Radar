"use client"
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

    const [poolDetails, setPoolDetails] = useState({title: "Post Title",trueAmount:1000000000, falseAmount:1000000000, result:1,lockTime:1787265359, endTime:1783526, manager:"manger", pdaBase58:"pda", desc:"Pool Description", option1:"option1", option2:"option2", uploadUrl:betlify, minBetAmount:0.01});
    const [pda, setPda] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [betAmount, setBetAmount] = useState("");
    const [odds, setOdds] = useState({yes:0.50, no:0.52});
    const [poolAmount, setPoolAmount] = useState({trueAmount:1, falseAmount:1});
    const [isExecuting, setIsExecuting] = useState(false);

    const wallet = useWallet();
    const {publicKey} = useWallet();
    const {connection} = useConnection();

    useEffect(()=>{
        if(!id) return;
        
        const _pda = id as string;

        const _getPoolDetails = async()=>{
            const response : any = await fetch(`/api/server/database?action=getpooldetails&pda=${_pda}`,{
                method: "GET"
            });

            const result = await response.json();

            const trueOdds = parseInt(result[0].trueAmount) + 1e9; //0.5 acts as a descriminant
            const falseOdds = parseInt(result[0].falseAmount) + 1e9;
            console.log("the trueodds is: ",trueOdds);
            console.log("the falseodds is: ",falseOdds);
            const yes = parseFloat((trueOdds / (trueOdds + falseOdds)).toFixed(2));
            const no = parseFloat((falseOdds / (trueOdds + falseOdds)).toFixed(2));

            setPoolAmount({trueAmount:trueOdds, falseAmount:falseOdds});
            setOdds({yes, no});


            setPoolDetails(result[0]);
            setPda(result[0].pdaBase58);
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
            const result = await PlaceBet(connection, wallet, poolDetails.title, poolDetails.manager, poolDetails.pdaBase58, parseFloat(betAmount)*LAMPORTS_PER_SOL, option);
            if (result.success){
                if(option ==1){
                    const yesAmount = poolAmount.trueAmount + parseFloat(betAmount)*LAMPORTS_PER_SOL;
                    const noAmount = poolAmount.falseAmount;
                    const newTrueOdds = parseFloat((yesAmount/(yesAmount + noAmount)).toFixed(2));
                    const newFalseOdds = parseFloat((noAmount/(yesAmount + noAmount)).toFixed(2));
                    setPoolAmount({trueAmount:yesAmount, falseAmount:noAmount});
                    setOdds({yes:newTrueOdds, no:newFalseOdds})
                }else if(option ==2){
                    const yesAmount = poolAmount.trueAmount;
                    const noAmount = poolAmount.falseAmount + parseFloat(betAmount)*LAMPORTS_PER_SOL;
                    const newTrueOdds = parseFloat((yesAmount/(yesAmount + noAmount)).toFixed(2));
                    const newFalseOdds = parseFloat((noAmount/(yesAmount + noAmount)).toFixed(2));
                    setPoolAmount({trueAmount:yesAmount, falseAmount:noAmount});
                    setOdds({yes:newTrueOdds, no:newFalseOdds})
                }
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

        const response = await claimWinnings(connection, wallet, poolDetails.title, poolDetails.manager, poolDetails.pdaBase58);
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

        const response = await sellPosition(connection, wallet, poolDetails.title, poolDetails.manager, poolDetails.pdaBase58, position);
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
                        <h1>{poolDetails.title}</h1>
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
                        <h2>{poolDetails.title}</h2>
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
                            <div className='play__options' style={{marginBottom:'0.5rem'}}>
                                <Button className='' style={{backgroundColor:'black', border:'none'}} onClick={()=>Bet(1)}>Buy {poolDetails.option1} ( ${odds.yes} ) </Button>
                                <Button className='' style={{backgroundColor:'black', border:'none'}} onClick={()=>Bet(2)}>Buy {poolDetails.option2} ( ${odds.no} )</Button>
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