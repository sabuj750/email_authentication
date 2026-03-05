import mongoose from "mongoose";
import "dotenv/config";

const connectDb = async () => {
  try{
    mongoose.connection.on('connected' , ()=> {
      console.log('Connected to MongoDB')
    })
    const mongoUri = `${process.env.MONGODB_URI}${process.env.MONGODB_URI.includes('?') ? '&' : '?'}retryWrites=true&w=majority`;
    await mongoose.connect(mongoUri, {
      dbName: 'mern-auth'
    })
  }catch(err){
    console.log(err)
  }
}

export default connectDb;