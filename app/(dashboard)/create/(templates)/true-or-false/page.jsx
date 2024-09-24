"use client"

import Link from "next/link";
import Image from "next/image";
import '../styles.css'
import { Button } from "react-bootstrap";
import avatar5 from 'public/images/avatar/avatar-5.jpg'

import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, SystemProgram, Transaction } from "@solana/web3.js";
import { useState } from "react";
import { CreateTFPool } from "app/api/server/blockchain/route";
import { createPoolDb } from "app/api/server/database/route";
import { useRouter } from "next/navigation";



const trueOrFalse = () => {
    const router = useRouter();

    const {publicKey} = useWallet();
    const {connection} = useConnection();
    const wallet = useWallet();

    const handleFilePreview = (e)=>{
        const file = e.target.files[0];
        setImage(file);

        if (file){
            const reader = new FileReader();
            reader.onloadend = ()=>{
                setPreview(reader.result);
                const base64 = reader.result.split(",")[1];
                const type = file.type;
                setImageBase64({base64, type})
            }
            reader.readAsDataURL(file);
        }
    }

    function endTimestamp(e){
        const timestamp = Math.floor((new Date(e.target.value)).getTime() / 1000);
        setEndTime(timestamp);
        console.log(timestamp.toString());
    }
    function lockTimestamp(e){
        const timestamp = Math.floor((new Date(e.target.value)).getTime() / 1000);
        setLockTime(timestamp);
        console.log(timestamp.toString());
    }
    function startTimestamp(e){
        const timestamp = Math.floor((new Date(e.target.value)).getTime() / 1000);
        setStartTime(timestamp);
        console.log(timestamp.toString());
    }

    const createPoolButton = async(e)=>{
        e.preventDefault();
        console.log("entered createpoolbutton");

        if(!publicKey) {
            console.log("Please Connect Your Wallet First.")
        }
        else{
            setDisable(true);
            try{
                const response = await CreateTFPool(connection, wallet, title, desc, imageBase64, startTime, lockTime, endTime, (minBetAmount*LAMPORTS_PER_SOL), houseFee, option1, option2);
                if(response.success){
                    alert(response.message);
                    router.push("/dashboard"); 
                }else{
                    alert(response.message)
                    setDisable(false);
                }
            }catch(e){
                alert("Failed to send create pool.");
            }
        }
    };

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [imageBase64, setImageBase64] = useState(null);
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [startTime, setStartTime] = useState(null);
    const [lockTime, setLockTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [minBetAmount, setMinBetAmount] = useState(null);
    const [houseFee, setHouseFee] = useState(null);
    const [option1, setOption1] = useState("");
    const [option2, setOption2] = useState("");
    
    const [disable, setDisable]= useState(false);

  return (
    <main className="create__main">
        <div className="create__title">
            <h2>Create A YES or NO Bet Pool </h2>
        </div>
        <section className="create__section">
            <section className="create__form">
                <form className="create__form" action={createPoolDb}>
                    <div className="create__date">
                        <label htmlFor="poolName">
                            <input type="text" name="poolName" onChange={(e)=>setTitle(e.target.value)} value={title} placeholder="Pool Name" disabled={disable} required/>
                        </label>
                        <label htmlFor="poolImage">
                            <input type="file" accept="image/*" onChange={handleFilePreview} name="poolImage" placeholder="Pool Image" disabled={disable} required/>
                        </label>
                    </div>
                    <div>
                        <textarea type="text" name="desc" placeholder="Enter a short description" onChange={(e)=>setDesc(e.target.value)} value={desc} disabled={disable} required/>
                    </div>
                    <div className="create__date">
                        <div>
                            <label htmlFor="startDate">
                                <input type="datetime-local" name="startDate" onChange={startTimestamp} disabled={disable} required/>
                            </label>
                        </div>
                        <div>
                            <label htmlFor="lockDate">
                                <input type="datetime-local" name="lockDate" onChange={lockTimestamp} disabled={disable} required/>
                            </label>
                        </div>
                        <div>
                            <label htmlFor="endDate">
                                <input type="datetime-local" name="endDate" onChange={endTimestamp} disabled={disable} required/>
                            </label>
                        </div>
                    </div>
                    <div className="create__options">
                        <label htmlFor="option1">
                            <input type="text" name="option1" onChange={(e)=>setOption1(e.target.value)} value={option1} placeholder="Option 1" disabled={disable} required/>
                        </label>
                        <label htmlFor="option2">
                            <input type="text" name="option2" onChange={(e)=>setOption2(e.target.value)} value={option2} placeholder="Option 2" disabled={disable} required/>
                        </label>
                    </div>
                    <div className="create__options">    
                        <label htmlFor="minAmount">
                            <input type="number" name="minAmount" onChange={(e)=>setMinBetAmount(e.target.value)} value={minBetAmount} placeholder="Min Bet Amount" disabled={disable} required/>
                        </label>
                        <label htmlFor="houseFee">
                            <input type="number" name="houseFee" onChange={(e)=>setHouseFee(e.target.value)} value={houseFee} placeholder="House Fee in % (max 6%)" disabled={disable} required/>
                        </label>
                    </div>
                    <Button style={{display:'block', width:'100%'}} onClick={(e)=>createPoolButton(e)} name="Create">Create Pool</Button>
                </form>
            </section>
            <section className="">
                <h2>#Preview</h2>
                <div className="create__preview">
                    <Image className="create__card__img" src={preview ? preview : avatar5} width={500} height={281} alt="pool image"/>
                    <div className="text__preview">
                        <h2>{title}</h2>
                        <p>{desc}</p>
                        <input className="betAmount" type="text" placeholder="Enter Bet Amount" disabled/>
                        <Button style={{marginBottom:'0.7rem'}} className="options__prev">Bet on {option1}</Button>
                        <Button className="options__prev">Bet on {option2}</Button>
                    </div>
                    {/* <Button className="submit__button">Place Bet</Button> */}
                </div>
            </section>
        </section>
    </main>
  )
}

export default trueOrFalse