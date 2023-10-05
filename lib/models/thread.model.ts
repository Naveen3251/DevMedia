import mongoose from 'mongoose';

//defining schema
const threadSchema=new mongoose.Schema({
    text:{ type: String, required:true},
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    community:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Community',
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    /*mutlilevel commecnt functionality
     ThreadP-->parent
        ->Thread1-->child
        ->Thread2-->child to ThreadP and parent to Threadk
            ->Threadk
    */ 
    parentId:{
        type:String
    },
    //Recurison
    children:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Thread'
        }
    ]
});

//scheam to model
const Thread=mongoose.models.Thread || mongoose.model('Thread',threadSchema);

export default Thread;