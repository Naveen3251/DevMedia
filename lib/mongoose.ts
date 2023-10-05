import mongoose from 'mongoose';

let isConnected=false; //var to check connection status

export const connectToDB=async()=>{
    mongoose.set('strictQuery',true)//to prevent unknown field query

    // not connected
    if(!process.env.MONGODB_URL) return console.log('MONGODB_URL not found');

    //connected
    if(isConnected)return console.log('Already connected to MongoDB');

    //to make connection
    //for this proj password for mongodb : 2VVrZk5LuPpT5YNm
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        isConnected=true;
        console.log('Connected to MongoDB');
    }catch(error){
        console.log(error);
    }

}