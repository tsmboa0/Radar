import mongoose from "mongoose";

import { MongoClient, ServerApiVersion } from "mongodb";

var username = encodeURIComponent("tsmboa");
var password = encodeURIComponent("MahdiAS18###");

const MONGO_DB_URI=`mongodb+srv://tsmboa:${password}@betlify.1ql5l.mongodb.net/?retryWrites=true&w=majority&appName=Betlify`

// const connectClient = new MongoClient(MONGO_DB_URI);

// const Client = new MongoClient(MONGO_DB_URI, {
//     serverApi: {
//       version: ServerApiVersion.v1,
//       strict: true,
//       deprecationErrors: true,
//     },
//     serverSelectionTimeoutMS: 10000
//   });

async function connectDb(){
  if(mongoose.connection.readyState !== 1){
    try {
      await mongoose.connect(MONGO_DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        minPoolSize: 10
    });
      console.log("mongo db is connected");
    } catch (error) {
      console.log("cannot connect to mongodb", error);
    }
  }else{
    console.log("db already connected");
  }
}


export default connectDb;