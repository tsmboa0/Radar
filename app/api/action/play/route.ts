
import { ActionGetRequest, ActionPostRequest, ActionPostResponse, ACTIONS_CORS_HEADERS, createActionHeaders, createPostResponse } from "@solana/actions"
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram, TransactionInstruction, Keypair } from "@solana/web3.js";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { useWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import _idl from "utils/program/idl.json";


const idl = JSON.parse(JSON.stringify(_idl));

import { getPoolDetails } from "app/api/server/database/route";

const PROGRAM_ID = new PublicKey("BPkp6UKXSFBVjkw8Zk4mxS2AYd7UHwxrJM8xSRSMov8K");
const _program = "BPkp6UKXSFBVjkw8Zk4mxS2AYd7UHwxrJM8xSRSMov8K"

const connection = new Connection(clusterApiUrl("devnet"), 'finalized');
// const provider = new anchor.AnchorProvider(connection, wallet: as AnchorWallet);

const headers = createActionHeaders();

export const GET = async(req:Request)=>{
    console.log("get request received...");
    const url = new URL(req.url);
    const pda : any = url.searchParams.get("id");
    const formData = new FormData();
    formData.append("pda", pda as string);
    console.log("the pda from the url is: ",pda);
    const poolPDA =  new PublicKey(pda);

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

        //fetch data from blockchain
        const provider = new anchor.AnchorProvider(
            connection,
            {
                publicKey: PROGRAM_ID,
                signTransaction: async (tx: Transaction) => tx,
                signAllTransactions: async (txs: Transaction[]) => txs,
            },
            {preflightCommitment: 'confirmed'}
        )
        const program = new anchor.Program(idl,PROGRAM_ID,provider);
        const detailOnchain : any = await program.account.trueOrFalsePool.fetch(poolPDA);
        const no_of_true : number = (detailOnchain.noOfTrue).toNumber();
        const no_of_false : number = (detailOnchain.noOfFalse).toNumber();
        const total : number = (no_of_true + no_of_false);
        const trueOdd = (no_of_true/total).toFixed(2);
        const falseOdd = (no_of_false/total).toFixed(2);
        console.log("the total is: ",total);
        console.log("the no of true is: ",no_of_true);
        console.log("the no of false is: ",no_of_false);

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
                            href: `/api/action/play?id=${pda}&claim=true`
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
                            label: `Buy ${option1} $${trueOdd}`,
                            href: `/api/action/play?id=${pda}&amount={amount}&option=1`,
                            parameters:[
                                {
                                    name: "amount",
                                    label: "Enter Buy Amount"
                                }
                            ]
                        },
                        {
                            label: `Buy ${option2} $${falseOdd}`,
                            href: `/api/action/play?id=${pda}&amount={amount}&option=2`,
                            parameters:[
                                {
                                    name: "amount",
                                    label: "Enter Buy Amount"
                                }
                            ]
                        },
                        {
                            label: `Sell ${option1}`,
                            href: `/api/action/play?id=${pda}&amount={amount}&sell=1`
                        },
                        {
                            label: `Sell ${option2}`,
                            href: `/api/action/play?id=${pda}&amount={amount}&sell=2`
                        }
                    ]
                }
            }
        }

        return Response.json(payload, {
            headers
        });
    }catch(e){
        console.log("failed to generate blinks",e)
    }
}

export const OPTIONS = async()=> Response.json(null, {headers});

export const POST = async(req:Request)=>{
    const url = new URL(req.url);
    const pda = url.searchParams.get("id") as string;
    const getOption = parseFloat(url.searchParams.get("option") as string);
    const getAmount = parseFloat(url.searchParams.get("amount") as string);
    console.log("inside post request from blinks and the pda is: ", pda);
    const data = new FormData();
    data.append("pda", pda);
    const pool = await getPoolDetails(data);
    const result = JSON.parse(pool);
    console.log("pool fetched..");
    const title = result.poolTitle;
    const poolId = new PublicKey(result.pda);
    const manager = new PublicKey(result.manager);

    const body: ActionPostRequest = await req.json();
    const userAccount = new PublicKey(body.account);
    const userOption = new anchor.BN(getOption);
    const betAmount = new anchor.BN(getAmount * LAMPORTS_PER_SOL);

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
    }else if (url.searchParams.has("sell")){
        if(url.searchParams.get("sell")=="1"){
            const builtTx = await program.methods.sellPosition(title, manager, poolId, new anchor.BN(1))
            .accounts({
                pool: poolId,
                userBet: userPDA,
                poolTreasury: treasury,
                bettor: userAccount,
                SystemProgram: systemProgram
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
            //sell false
            const builtTx = await program.methods.sellPosition(title, manager, poolId, new anchor.BN(2))
            .accounts({
                pool: poolId,
                userBet: userPDA,
                poolTreasury: treasury,
                bettor: userAccount,
                SystemProgram: systemProgram
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
        }
    }
    else{
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
            headers
        });
    }
}