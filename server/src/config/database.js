import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();

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
export default connectDB;
