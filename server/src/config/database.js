import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();

console.log( process.env.API_KEY);


const connectDB = async () =>{
    try{
        console.log("Trying to connect");
        const conn = await mongoose.connect( process.env.MONGODB_URI);

        console.log(`Mongo connnected : ${conn.connection.host}`);
    }
    catch( error){
        console.error('MongoDB connection error ' , error);
        process.exit(1);
    }

};


connectDB();
export default connectDB;


