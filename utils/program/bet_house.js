import * as anchor from "@project-serum/anchor";
import { Connection, PublicKey } from "@solana/web3.js";

import idl from "./idl.json"

const programID = new PublicKey("7CrcbfqyecWEZXDGXVtQMDDeyjcHtScSjCLecgbPtAQC");

export const getProgram = (connection)=>{
    console.log("inside getProgram");
    // const connection = new Connection('https://api.devnet.solana.com');
    const provider = new anchor.AnchorProvider(connection, window.solana, {
        preflightCommitment: "processed"
    });
    console.log("provider set");
    const program = new anchor.Program(idl, programID, provider);
    console.log("program defined"); 

    return program
}

export const CreateTFPool = async(publicKey,connection, title, startTime, lockTime, endTime, minimumBetAmount, houseFee)=>{
    console.log("inside create pool...tx");
    const program = getProgram(connection);

    console.log("program calculated from getProgram func");

    try{
        const [pda] = PublicKey.findProgramAddressSync([Buffer.from(title), publicKey.publicKey.toBuffer()], program.programId);
    }catch(e){
        console.log("err creating pda..", e);
    }
    console.log("pda derived...");
    
    try{
        const txHash = await program.methods
        .CreateTFPool(title, new anchor.BN(startTime), new anchor.BN(lockTime), new anchor.BN(endTime), minimumBetAmount, houseFee)
        .accounts({
            pool : pda,
            manager: wallet.PublicKey,
            systemProgram : anchor.web3.SystemProgram.programId
        })
        .rpc()
    }catch(e){
        console.log("error occured, ",e);
    }

    await connection.confirmTransaction({signature : txHash});

}