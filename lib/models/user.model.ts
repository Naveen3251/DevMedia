import mongoose from 'mongoose';

//defining schema
const userSchema=new mongoose.Schema({
    id : {type:String,required:true},
    username : {type:String,required:true},
    name : {type:String,required:true},
    image : String,
    bio : String,

    //one user can have multiple ref to specific threads stored in db
    threads : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Thread'
        }
    ],

    onboarded:{
        type:Boolean,
        deafult:false
    },

    //one use can belong to many communities and viceversa
    communities:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Community'
        }
    ]

})

//scheam to model
const User=mongoose.models.User || mongoose.model('User',userSchema);

export default User;