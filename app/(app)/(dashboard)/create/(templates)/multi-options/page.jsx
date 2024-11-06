"use client"

import Link from "next/link";
import Image from "next/image";
import '../styles.css'
import { Button, Modal, Spinner } from "react-bootstrap";
import avatar5 from 'public/images/avatar/avatar-5.jpg';
import mockup from "public/images/background/true-or-false.png";

import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, SystemProgram, Transaction } from "@solana/web3.js";
import { useState } from "react";
import { CreateTFPool } from "app/api/server/blockchain/route";
import { useRouter } from "next/navigation";
import {CheckCircleFill, XCircleFill, CodeSlash} from "react-bootstrap-icons";


const OnetoMany = () => {
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
            alert("Connect your wallet first");
        }
        else{
            setDisable(true);
            setIsModal(true);
            try{
                const _response = await CreateTFPool(connection, wallet, title, desc, imageBase64, startTime, lockTime, endTime, (minBetAmount*LAMPORTS_PER_SOL), houseFee, option1, option2, resultUrl);
                if(_response.success){
                    setResponse({ success: 1, message: _response.message, pda:_response.pda });
                    // router.push("/dashboard"); 
                }else{
                    setResponse({ success: 2, message: _response.message });
                    // setIsModal(false);
                    // setDisable(false);
                }
            }catch(e){
                console.log("Failed to send create pool.");
            }
        }
    };

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [imageBase64, setImageBase64] = useState(null);
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [startTime, setStartTime] = useState(0);
    const [lockTime, setLockTime] = useState(0);
    const [endTime, setEndTime] = useState(0);
    const [minBetAmount, setMinBetAmount] = useState(null);
    const [houseFee, setHouseFee] = useState(null);
    const [option1, setOption1] = useState("");
    const [option2, setOption2] = useState("");
    const [resultUrl, setResultUrl] = useState("");
    const [isModal, setIsModal] = useState(false);
    const [response, setResponse] = useState({success:0, message:"Creating Pool...", pda:"somepda"});
    
    const [disable, setDisable]= useState(false);

  return (
    <main className="create__main">
        <div className="create__title">
            <h2>Create A TRUE or FALSE Bet Pool </h2>
        </div>
        <section className="create__section">
            <section className="create__form">
                <form className="create__form" onSubmit={createPoolButton}>
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
                                Start Time :
                                <input type="datetime-local" name="startDate" onChange={startTimestamp} disabled={disable} required/>
                            </label>
                        </div>
                        <div>
                            <label htmlFor="lockDate">
                                Lock Time :
                                <input type="datetime-local" name="lockDate" onChange={lockTimestamp} disabled={disable} required/>
                            </label>
                        </div>
                        <div>
                            <label htmlFor="endDate">
                                End Time :
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
                    <div>
                        <input type="text" placeholder="result source url" onChange={(e)=>setResultUrl(e.target.value)} value={resultUrl} required/>
                    </div>
                    <div>
                        <Button style={{display:'block', width:'100%', backgroundColor:'black', border:'none'}} type="submit" name="Create">Create Pool</Button>
                    </div>
                </form>
            </section>
            <section className="">
                <h2>#Preview</h2>
                <div className="create__preview">
                    <Image className="create__card__img" src={preview ? preview : mockup} width={500} height={281} alt="pool image"/>
                    <div className="text__preview">
                        <h2>{title}</h2>
                        <p>{desc}</p>
                        <input className="betAmount" type="text" placeholder="Enter Bet Amount" disabled/>
                        <Button style={{marginBottom:'0.7rem', backgroundColor:'black', border:'none'}} className="options__prev">Bet on {option1}</Button>
                        <Button style={{backgroundColor:'black', border:'none'}} className="options__prev">Bet on {option2}</Button>
                    </div>
                    {/* <Button className="submit__button">Place Bet</Button> */}
                </div>
            </section>
        </section>
        <Modal show={isModal} onHide={()=> {setIsModal(false); setResponse({success:0, message:"Creating Pool..."});setDisable(false)}} centered>
            <Modal.Body className="text-center">
                <h3 className="text-center">{response.success == 0 ? (<CodeSlash color="#0275d8" size={50} />) : response.success ==1 ? (<CheckCircleFill color="green" size={50}/>) : (<XCircleFill color="red" size={50}/>)}</h3>
                <Spinner animation="border" role="status" style={{display : response.success !== 0 ? 'none' : ''}}>
                <span className="visually-hidden">Loading...</span>
                </Spinner>
                <h3 className="mt-2">{response.message}</h3>
                {response.success !== 0 ? (
                    <Button style={{backgroundColor:'black', border:'none'}} onClick={response.success == 1 ? ()=> router.push(`/pool/${response.pda}`) : ()=>{setIsModal(false);setResponse({success:0, message:"Creating Pool..."});setDisable(false)}}>Ok</Button>
                ) : (
                    <div></div>
                )}
            </Modal.Body>
        </Modal>
    </main>
  )
}

export default OnetoMany