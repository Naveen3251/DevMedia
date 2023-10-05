//slight diff from user model
import mongoose from 'mongoose';

//defining schema
const communitySchema=new mongoose.Schema({
    id : {type:String,required:true},
    username : {type:String,required:true},
    name : {type:String,required:true},
    image : String,
    bio : String,
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },

    //one user can have multiple ref to specific threads stored in db
    threads : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Thread'
        }
    ],

    members:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ]


})

//scheam to model
const Community=mongoose.models.Community || mongoose.model('Community',communitySchema);

export default Community;