// "use server"
// @ts-nocheck

import * as anchor from "@project-serum/anchor";
import {AnchorWallet } from "@solana/wallet-adapter-react";
import { createPoolDb, setDbResult } from "../database/route";
// import getProvider from "utils/program/provider";

import idl from "utils/program/idl.json";
import { PublicKey, SystemProgram, Connection, clusterApiUrl, SIGNATURE_LENGTH_IN_BYTES } from "@solana/web3.js";

const programID = new anchor.web3.PublicKey("7CrcbfqyecWEZXDGXVtQMDDeyjcHtScSjCLecgbPtAQC");
// const {connection} = useConnection();
// const wallet = useWallet() as AnchorWallet;
const commitment = "processed";

export const getProvider = (connection:any, wallet:any)=>{
    const provider = new anchor.AnchorProvider(connection, wallet as AnchorWallet, {
        preflightCommitment: commitment
    });
    const program = new anchor.Program(JSON.parse(JSON.stringify(idl)) as any, programID, provider);

    return program
}

export const onchainPoolDetails = async(connection:any, wallet:any, _pda: string)=>{
    console.log("before program ID");
    const program = getProvider(connection, wallet);
    console.log("inside onChain details");

    const pda = new PublicKey(_pda);
    console.log("pda converted to pubKey");

    const poolData = await program.account.trueOrFalsePool.fetch(pda);
    console.log("the pool details are...");

    return JSON.stringify(poolData);
}

export const CreateTFPool = async(connection:any, wallet: any, title:string, desc:string, image:any, startTime:number, lockTime:number, endTime:number, minBetAmount:number, houseFee:number, option1:string, option2:string)=>{
    const program = getProvider(connection, wallet);
    console.log("program passed..");
    console.log("user wallet is: ", (wallet.publicKey).toBase58())
    const anchorWallet = wallet as AnchorWallet;
    const [pda] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from(title), anchorWallet?.publicKey.toBuffer()], program.programId);
    const [treasury] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("treasury"), pda.toBuffer()], program.programId);
    console.log("the pool treasury is: ",treasury.toBase58());
    console.log("pda derived: ",pda.toBase58());

    try{
        console.log("starting tx")
        const txHash = await program.methods
        .createTfPool(title, new anchor.BN(startTime), new anchor.BN(lockTime), new anchor.BN(endTime), new anchor.BN(minBetAmount), new anchor.BN(houseFee))
        .accounts({
            pool: pda,
            treasury: treasury,
            manager: wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId
        })
        .rpc()
        console.log("end tx");

        await connection.confirmTransaction({
            signature: txHash
        }, "finalized");

        console.log("tx confirmed.");

        const poolDetails = await program.account.trueOrFalsePool.fetch(pda);
        console.log("the pool details is: ", poolDetails);

        try{
            //pda must follow here...
            const formData = new FormData;
            formData.append("poolName", title);
            formData.append("desc", desc);
            formData.append("pda", pda.toBase58());
            formData.append("manager", wallet.publicKey.toBase58());
            formData.append("startTime", startTime.toString());
            formData.append("lockTime", lockTime.toString());
            formData.append("endTime", endTime.toString());
            formData.append("minBetAmount", minBetAmount.toString());
            formData.append("houseFee", houseFee.toString());
            formData.append("option1", option1);
            formData.append("option2", option2);
            formData.append("image", image.base64);
            formData.append("type", image.type);

            console.log("All form data passed..");

            const dbEntry = await createPoolDb(formData);

            return {success:true, message:"Pool Created Successfully."}
        }catch(err){
            return{success:false, message:"Pool Creation failed. Please try again."}
        }

    }catch(e){
        console.log("an error occured: ", e);
        return{success:false, message:"Pool Creation failed. Please try again."}
    }
}

export const PlaceBet = async(connection: any, wallet: any, title: string, _manager:string, _poolId: string, betAmount:number, option:number)=>{ 
    const program = getProvider(connection, wallet);
    const userWallet = wallet as AnchorWallet;
    const poolId = new PublicKey(_poolId);
    const manager = new PublicKey(_manager);

    console.log("inside placebet chain and program set");

    const [userBetPDA] = PublicKey.findProgramAddressSync([poolId.toBuffer(), wallet.publicKey.toBuffer()], program.programId);
    const [poolPda] = PublicKey.findProgramAddressSync([Buffer.from(title), manager.toBuffer()], program.programId);
    const [pool_treasury] = PublicKey.findProgramAddressSync([Buffer.from("treasury"), poolPda.toBuffer()], program.programId);

    console.log("PDA details gotten");
    console.log("user pda is: ",userBetPDA.toBase58());

    try{
        const signature = await program.methods.placeBetTf(title, manager, poolId, new anchor.BN(betAmount),new anchor.BN(option))
        .accounts({
            userBet : userBetPDA,
            pool: poolPda,
            poolTreasury: pool_treasury,
            bettor: wallet.publicKey,
            SystemProgram: anchor.web3.SystemProgram.programId
        })
        .rpc();

        console.log("trying to confrim tx");

        await connection.confirmTransaction({
            signature: signature
        }, "finalized");

        console.log("tx confirmed..");
        const userBetDetail=  await program.account.betTf.fetch(userBetPDA);
        console.log("Your bet amount and option is: ",userBetDetail);

        return {success:true, message: "Bet Placed Successfully." }
    }catch(e:any){
        console.log("place bet failed", e);
        return {success:false, message: e.message }
    }
}

export const setResult = async(connection : any, wallet: any, title:string)=>{
    const program = getProvider(connection, wallet);
    const poolTitle = title;
    const result : number = 1

    const [poolPDA] = PublicKey.findProgramAddressSync([Buffer.from(poolTitle), wallet.publicKey.toBuffer()],program.programId);

    const signature = await program.methods.setTfResult(poolTitle, new anchor.BN(result))
    .accounts({
        pool: poolPDA,
        manager: wallet.publicKey,
        SystemProgram: anchor.web3.SystemProgram.programId
    })
    .rpc()

    await connection.confirmTransaction({
        signature : signature
    }, "confirmed");

    console.log("result set successfully... proceeding to set result in database");

    const data = new FormData();
    data.append("result", (result).toString());
    data.append("pda", (poolPDA).toBase58());
    const setdb = await setDbResult(data);

    console.log("result set in the database...");

    const verify = await program.account.trueOrFalsePool.fetch(poolPDA);

    console.log("the pool account details are: ",verify);
}

export const claimWinnings = async(connection:any, wallet:any, title:string, _manager:string, pda: string)=>{
    const program = getProvider(connection, wallet);
    const poolId = new PublicKey(pda);
    const manager = new PublicKey(_manager)

    const [poolPDA] = PublicKey.findProgramAddressSync([Buffer.from(title), manager.toBuffer()], program.programId);
    const [userBetPDA] = PublicKey.findProgramAddressSync([poolId.toBuffer(), wallet.publicKey.toBuffer()], program.programId);
    const [pool_treasury] = PublicKey.findProgramAddressSync([Buffer.from("treasury"), poolPDA.toBuffer()], program.programId);

    try{
        const signature = await program.methods.claimTfWin(title, manager, poolId)
        .accounts({
            pool: poolPDA,
            userBet: userBetPDA,
            poolTreasury: pool_treasury,
            bettor: wallet.publicKey,
            SystemProgram: anchor.web3.SystemProgram.programId
        })
        .rpc();

        console.log("claim successful");

        return{message: "Winnings claimed successfully."}
    }catch(e){
        return{message: `claimed failed with error message: ${e}`}
    }

}