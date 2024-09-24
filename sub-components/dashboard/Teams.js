// import node module libraries
"use client"

import React, { useEffect } from "react";
import Link from 'next/link';
import { Card, Table, Dropdown, Image, Button } from 'react-bootstrap';
import { MoreVertical } from 'react-feather';

// import required data files
import { getPoolDetails } from "app/api/server/database/route";
import { onchainPoolDetails } from "app/api/server/blockchain/route";
import { setResult } from "app/api/server/blockchain/route";
import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
const Teams = ({pda}) => {

    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        (<Link
            href=""
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
            className="text-muted text-primary-hover">
            {children}
        </Link>)
    ));

    const wallet = useWallet();
    const {publicKey}= useWallet();
    const {connection} = useConnection()

    const [poolDetail, setPoolDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEdit, setIsEdit] = useState(false);
    const [onChain, setOnChain] = useState(null);

    const submitResult = async()=>{
        console.log("begin set result");

        if(!publicKey) alert("please connect your wallet first");

        const response = await setResult(connection, wallet, poolDetail.poolTitle);
        alert("result set successfully...");
        console.log("result set success...");
    }

    const getPoolOnchain = async()=>{
        console.log("fetching onChain results");
        if(!publicKey) alert("please connect your wallet first");
        const response = await onchainPoolDetails(connection, wallet, poolDetail.pda);
        console.log("onChain pool result is : ",JSON.parse(response));
        setOnChain(JSON.parse(response));
    }

    useEffect(()=>{
        const fetchPool = async()=>{
            const data = new FormData();
            data.append("pda", pda)
            console.log("initializing getPooletails");
            const response = await getPoolDetails(data);
            const result = JSON.parse(response);

            setPoolDetail(result);
            setIsLoading(false);
        };
        fetchPool();
    },[]);

    return (
        <Card className="h-100" style={{marginLeft:'0'}}>
            {isLoading? (
                <div>Loading...</div>
            ): 
            isEdit ? (
                <section style={{display:'flex', flexFlow:'column', padding:'0.6rem'}}>
                    <div style={{display:'flex', flexGrow:'1', flexFlow:'row wrap', marginTop:'1.5rem', justifyContent:'center', alignItems:'center', gap:'1rem'}}>
                        <Button>Lock Pool</Button>
                        <Button onClick={submitResult}>Set Result</Button>
                        <Button>Claim House Fee</Button>
                        <Button>Cancel Pool</Button>
                        <Button>Set End Date</Button>
                        <Button>Close Pool</Button>
                        <Button onClick={getPoolOnchain}>Get Onchain Pool Details</Button>
                    </div>
                    <div style={{display:'grid', placeContent:'center', position:'sticky', bottom:'0'}}>
                            <Button style={{backgroundColor:'#642BFF', color:'white', margin:'1rem'}} onClick={()=>setIsEdit(false)}>Back to Pool Details</Button>
                        </div>
                </section>
            ) : (
                (
                    <section>
                        <Table responsive className="text-wrap">
                            <tbody>
                                <tr>
                                    <td className="align-middle">Pool Title</td>
                                    <td className="align-middle">{poolDetail.poolTitle}</td>
                                </tr>
                                <tr>
                                    <td className="align-middle">Pool Description</td>
                                    <td className="align-middle">{poolDetail.desc}</td>
                                </tr>
                                <tr>
                                    <td className="align-middle">Start Time</td>
                                    <td className="align-middle">{(new Date((parseInt(poolDetail.startTime))*1000)).toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td className="align-middle">Lock Time</td>
                                    <td className="align-middle">{(new Date((parseInt(poolDetail.lockTime))*1000)).toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td className="align-middle">End Time</td>
                                    <td className="align-middle">{(new Date((parseInt(poolDetail.endTime))*1000)).toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td className="align-middle">Option 1</td>
                                    <td className="align-middle">{poolDetail.option1}</td>
                                </tr>
                                <tr>
                                    <td className="align-middle">Option 2</td>
                                    <td className="align-middle">{poolDetail.option2}</td>
                                </tr>
                                <tr>
                                    <td className="align-middle">Result</td>
                                    <td className="align-middle">{poolDetail.result}</td>
                                </tr>
                            </tbody>
                        </Table>
                        <div style={{display:'grid', placeContent:'center'}}>
                            <Button style={{backgroundColor:'#642BFF', color:'white', margin:'1rem'}} onClick={()=>setIsEdit(true)}>Edit</Button>
                        </div>
                    </section>
                )
            )
            }
        </Card>
    )
}

export default Teams