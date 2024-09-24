
import { ActionGetRequest, ActionPostRequest, ActionPostResponse, ACTIONS_CORS_HEADERS, createPostResponse } from "@solana/actions"
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram, TransactionInstruction, Keypair } from "@solana/web3.js";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { useWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import _idl from "utils/program/idl.json";


const idl = JSON.parse(JSON.stringify(_idl));

import { getPoolDetails } from "app/api/server/database/route";
import { URLSearchParams } from "url";

const PROGRAM_ID = new PublicKey("7CrcbfqyecWEZXDGXVtQMDDeyjcHtScSjCLecgbPtAQC");
const _program = "7CrcbfqyecWEZXDGXVtQMDDeyjcHtScSjCLecgbPtAQC"

const connection = new Connection(clusterApiUrl("devnet"), 'finalized');
// const provider = new anchor.AnchorProvider(connection, wallet: as AnchorWallet);

export const GET = async(req:Request, {params}:{params: {slug:string}})=>{
    const pda = params.slug;
    const formData = new FormData();
    formData.append("pda", pda);

    console.log("starting the try block in blinks");

    try{
        const poolDetail : any = await getPoolDetails(formData);
        const result = JSON.parse(poolDetail);

        console.log("Blinks pool title is: ",result.poolTitle);

        const title = result.poolTitle;
        const desc = result.desc;
        const option1 = result.option1;
        const option2 = result.option2;
        const icon = result.uploadUrl;

        let payload: ActionGetRequest;

        if(parseInt(result.endTime)*1000 < Math.floor(new Date().getTime())){
            payload  = {
                icon: icon,
                title: title,
                description: `${desc}\n The Result is: ${result.result}`,
                links: {
                    actions: [
                        {
                            label: "Claim Winnings",
                            href: `/api/action/play/${pda}?claim=true`
                        }
                    ]
                }
            }
        }else{
            payload = { 
                icon: icon,
                title: title,
                description: desc,
                links: {
                    actions : [
                        {
                            label: option1,
                            href: `/api/action/play/${pda}?amount={amount}&option=1`,
                            parameters:[
                                {
                                    name: "amount",
                                    label: "Enter Bet Amount"
                                }
                            ]
                        },
                        {
                            label: option2,
                            href: `/api/action/play/${pda}?amount={amount}&option=2`,
                            parameters:[
                                {
                                    name: "amount",
                                    label: "Enter Bet Amount"
                                }
                            ]
                        }
                    ]
                }
            }
        }

        return Response.json(payload, {
            headers: ACTIONS_CORS_HEADERS
        });
    }catch(e){
        console.log("failed to generate blinks",e)
    }
}

export const OPTIONS = GET;

export const POST = async(req:Request, {params}:{params: {slug:string}})=>{
    console.log("inside post request from blinks and the pda is: ", params.slug);
    const data = new FormData();
    data.append("pda", params.slug);
    const pool = await getPoolDetails(data);
    const result = JSON.parse(pool);
    console.log("pool fetched..");
    const title = result.poolTitle;
    const poolId = new PublicKey(result.pda);
    const manager = new PublicKey(result.manager);

    const body: ActionPostRequest = await req.json();
    const userAccount = new PublicKey(body.account);
    const userOption = new anchor.BN(1);
    const url : any = new URL(req.url);
    const betAmount = new anchor.BN(0.1 * LAMPORTS_PER_SOL);

    console.log("the amount is: ",betAmount);

    ///Anchor build tx/////
    const provider = new anchor.AnchorProvider(
        connection,
        {
            publicKey: userAccount,
            signTransaction: async (tx: Transaction) => tx,
            signAllTransactions: async (txs: Transaction[]) => txs,
        },
        {preflightCommitment: 'confirmed'}
    )
    const program = new anchor.Program(idl,PROGRAM_ID,provider);

    const [userPDA] = PublicKey.findProgramAddressSync([poolId.toBuffer(), userAccount.toBuffer()], PROGRAM_ID);
    const [treasury] = PublicKey.findProgramAddressSync([Buffer.from("treasury"), poolId.toBuffer()], PROGRAM_ID);
    const systemProgram = anchor.web3.SystemProgram.programId;

    if(url.searchParams.has("claim")){
        console.log("building cliam transactions...");
        const builtTx = await program.methods.claimTfWin(title, manager, poolId)
        .accounts({
            pool: poolId,
            userBet: userPDA,
            poolTreasury: treasury,
            bettor: userAccount,
            systemProgram: systemProgram
        })
        .transaction();
        const {blockhash} = await connection.getLatestBlockhash();
        builtTx.recentBlockhash = blockhash;
        builtTx.feePayer = userAccount;

        const payload : ActionPostResponse = await createPostResponse({
            fields:{
                transaction: builtTx,
                message: "Winning Claimed Successfully"
            }
        });

        return Response.json(payload, {
            headers: ACTIONS_CORS_HEADERS
        });
    }else{
        console.log("building placebet tx");
        const builtTx = await program.methods.placeBetTf(title, manager, poolId, betAmount, userOption)
        .accounts({
            userBet: userPDA,
            pool: poolId,
            poolTreasury: treasury,
            bettor: userAccount,
            systemProgram: systemProgram,
        })
        .transaction()
        const {blockhash} = await connection.getLatestBlockhash();
        builtTx.recentBlockhash = blockhash;
        builtTx.feePayer = userAccount;

        const payload : ActionPostResponse = await createPostResponse({
            fields:{
                transaction: builtTx,
                message: "Bet Placed Successfully"
            }
        });

        return Response.json(payload, {
            headers: ACTIONS_CORS_HEADERS
        });
    }
}