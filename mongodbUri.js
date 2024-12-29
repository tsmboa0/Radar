
import { MongoClient, ServerApiVersion } from "mongodb";

const mongoPass = encodeURIComponent(process.env.MONGO_PASS);
const uName = encodeURIComponent("tsmboa")
const MONGO_DB_URI = `mongodb+srv://${uName}:${mongoPass}`+process.env.MONGO_DB_URI;


const Client = new MongoClient(MONGO_DB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});




export default Client;