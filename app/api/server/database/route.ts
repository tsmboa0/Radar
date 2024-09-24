"use server"

import cloudinary from "cloudinaryConfig";
import mongoose from "mongoose";

import {auth} from "auth"
import connectDb from "mongodbUri";

const PoolSchema =new mongoose.Schema({
    user: String,
    pda: String,
    manager: String,
    poolTitle: String,
    desc: String,
    uploadUrl: String,
    startTime: String,
    lockTime: String,
    endTime: String,
    minBetAmount: String,
    houseFee: String,
    option1: String,
    option2: String,
    result: String
});

const Pool = mongoose.models.Pools || mongoose.model("Pools", PoolSchema);

export async function createPoolDb(formData : FormData){
    console.log("inside database server");
    const session = await auth();
    console.log("auth gotten..")
    await connectDb();

    const user = session?.user?.id || "tsmboa";
    const poolTitle = formData.get("poolName");
    console.log("postTitle is, ",poolTitle);
    const desc = formData.get("desc");
    const pda = formData.get("pda");
    const manager = formData.get("manager");
    const startTime = formData.get("startTime");
    const lockTime = formData.get("lockTime");
    const endTime = formData.get("endTime");
    const minBetAmount = formData.get("minBetAmount");
    const houseFee = formData.get("houseFee");
    const option1 = formData.get("option1");
    const option2 = formData.get("option2");
    const mimeType = formData.get("type");
    console.log("image type is: ", mimeType);
    const image = formData.get("image");
    // console.log("image string is: ", image);


    try{
        console.log("initializing cloudinary upload.");
        const upload = await cloudinary.uploader.upload(`data:${mimeType};base64,${image}`, {
            folder: "pool-Images",
            resource_type: "image"
        });

        console.log("uploaded to cloudinary");

        const uploadUrl = upload.secure_url;
        console.log("file uplaoded to cloudinary");

        //After uploading image to cloudinary, add collection to mongodb database
        try{
            const createPool = new Pool({
                user, pda, manager, poolTitle, desc, uploadUrl, startTime, lockTime, endTime, minBetAmount, houseFee, option1, option2,result:"0"
            });

            await createPool.save();

            console.log("Pool created successfully in the database");
        }catch(e){
            console.log("an err occured while creating a pool in te database ",e)
        }
    }catch(err:any){
        console.log(err);
        return {success:false, message:"Could not complete the database"}
    }

}

export const setDbResult = async(formData : FormData)=>{
    await connectDb();
    const result = formData.get("result");
    const pda = formData.get("pda");
    const Pools = mongoose.models.Pools;
    const response = await Pools.updateOne({pda:pda}, {$set : {result : result}});
    // response.save();

    console.log("Pool result set.");
}

export async function getPoolDetails(formData : FormData){
    console.log("proceeding to get pool details...");
    const pda = formData.get("pda");
    console.log("the pda is: ",pda);
    await connectDb();

    const poolDetail = await Pool.findOne({pda: pda});

    return JSON.stringify(poolDetail);
}

export async function getManagerPools(formData : FormData){
    console.log("proceeding to get manager pools...");
    const user = formData.get("user");
    await connectDb();
    console.log("Pool initialized...");

    const managerPools = await Pool.find({user: "tsmboa"});
    console.log("manager pools fetched", managerPools);

    return JSON.stringify(managerPools);
}