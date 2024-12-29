"use server"

import cloudinary from "cloudinaryConfig";
import mongoose, { Collection } from "mongoose";
import * as anchor from "@project-serum/anchor";
import _idl from "utils/program/idl.json";


import {auth} from "auth"
import Client from "mongodbUri";

const idl = JSON.parse(JSON.stringify(_idl));
const eventCoder = new anchor.BorshEventCoder(idl);

const connectClient = async()=>{
    const client = await Client.connect();
    console.log("Clinet connected to MongoDB");
    const db = client.db("betlify");
    const collection = db.collection("Pools");

    const session = await auth();
    const user = session?.user?.name

    return {client, collection, user};
}

const updateBetOdds = async(amount :any, poolId:any, option:any)=>{
    const {client, collection, user} = await connectClient();
    try{
        if(option == 1){
            const result = await collection.updateOne({pdaBase58: poolId}, {$inc: {trueAmount: amount}});
            console.log("Bet Odds updated")
        }else if(option == 2){
            const result = await collection.updateOne({pdaBase58: poolId}, {$inc: {falseAmount: amount}});
            console.log("Bet Odds updated")
        }else{
            console.log("Invalid Option passed!");
        }
    }catch(e){
        console.log(e)
    }
}

export async function GET(req: Request){
    const {searchParams} = new URL(req.url);
    const action = searchParams.get("action");
    console.log("Trying to connect back to the MongoDB");
    const {client, collection, user} = await connectClient();
    switch (action){
        case "getpooldetails":
            console.log("Get pool details entered in the server");
            const pda = searchParams.get("pda");
            console.log("the server pda is :", pda);

            const poolDetails = await collection.find({pdaBase58: pda}).toArray();

            return new Response(JSON.stringify(poolDetails), {status: 200});

        case "getmanagerpools":
            console.log("Inide the get managers pools details on the database server");

            console.log("the user is : ",user);
            const managerPools = await collection.find({user:user}).toArray();
            return new Response(JSON.stringify(managerPools), {status: 200});
        case "allpools":
            const allPools = collection.find({});

            return new Response(JSON.stringify(allPools), {status: 200});

        default:
            return new Response(JSON.stringify({error: "Unknown Operation"}), {status: 405});
    }
}

export async function POST(req: Request){
    console.log("Entered the post section");
    const action = new URL(req.url).searchParams.get("action");
    const {client, collection, user} = await connectClient();

    switch (action){
        case "createpool":
            console.log("Inside the create pool server");
            const body = await req.json();
            const {pdaBase58, manager, title, desc, startTime, lockTime, endTime, minBetAmount_, houseFee, option1, option2, resultUrl, mimeType, imageBase64} = body;

            try{
                console.log("initializing cloudinary upload.");
                const upload = await cloudinary.uploader.upload(`data:${mimeType};base64,${imageBase64}`, {
                    folder: "pool-Images",
                    resource_type: "image"
                });

                console.log("uploaded to cloudinary");

                const uploadUrl = upload.secure_url;
                console.log("file uplaoded to cloudinary");

                const newPool = await collection.insertOne(
                    {
                        user, pdaBase58, manager, title, desc, startTime, lockTime, endTime, minBetAmount_ , houseFee, option1, option2, resultUrl, mimeType, uploadUrl, trueAmount:0, falseAmount:0
                    }
                );
                console.log("Pool created successfully");
                return new Response(JSON.stringify({success: "Pool created successfully!"}), {status: 200});
            }catch(e){
                console.log("Pool creation failed with : ",e);
                return new Response(JSON.stringify({error: `Failed to create pool with ${e}`}), {status: 400})
            }finally{
                client.close();
                console.log("Client closed sucessfully");
            }
        case "setresult":
            const {id, result} = await req.json();
            try{
                const setResult = await collection.updateOne({pda:id}, {$set: {result: result}});
                console.log("Result set in the database successfully");
                return new Response(JSON.stringify({success: "Result set successfully!"}), {status: 200});
            }catch(e){
                console.log("Failed to set result with: ",e);
                return new Response(JSON.stringify({error: `Failed to set pool result with ${e}`}), {status: 400})
            }finally{
                client.close();
                console.log("Client closed sucessfully");
            }
        case "deletepool":
            const {poolId} = await req.json();
            const deleted = await collection.deleteOne({pda:poolId});
            console.log("Pool deleted success");
            return new Response(JSON.stringify({success: "Pool deleted successfully!"}), {status: 200});

        case "streams":
            const data = await req.json();
            console.log("The straem data is: ", data.data);
            const logs = data.data;

            try{
                logs.forEach((log :string) => {
                    const parsedLog : any = eventCoder.decode(log);
                    console.log("the parsed log is: ",parsedLog);
                    const playerPublicKey = parsedLog.data.player.toBase58();
                    const amount = parsedLog.data.amount.toNumber();
                    const poolId_ = parsedLog.data.poolId.toBase58();
                    const option = parsedLog.data.option; 
    
                    // Output the extracted information
                    console.log("Player Public Key:", playerPublicKey);
                    console.log("Amount:", amount);
                    console.log("Pool ID:", poolId_);
                    console.log("Option:", option);
    
                    updateBetOdds(amount, poolId_, option);
                    console.log("Bet Odds updated");
                });
            }catch(e){
                console.log(`An Error occured: ${e}`);
            }

            return new Response(JSON.stringify({success: "Data delivered to webhook!"}), {status: 200});
        default:
            return new Response(JSON.stringify({error: "Unknown Operation!"}), {status: 405});
    }
}