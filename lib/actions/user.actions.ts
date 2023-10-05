"use server"
import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";

interface Params{
    userId:string,
    username:string,
    name:string,
    bio:string,
    image:string,
    path:string

}
export async function updateUser({
    userId,
    username,
    name,
    bio,
    image,
    path
}:Params):Promise<void>{

    connectToDB();

    try{
        await User.findOneAndUpdate(
            {id: userId},
            {
                username: username?.toLowerCase(),
                name,
                bio,
                image,
                onboarded:true
            },
            {upsert:true}
        );
    
        if(path==='/profile/edit'){
            //used for scenarios where you want to update your cached data without waiting for a revalidate period to expire
            revalidatePath(path);
        }
    }catch(error:any){
        throw new Error(`Failed to create/update user: ${error.message}`)
    }
};

//to fetch user info
export async function fetchUser(userId:string){
    try{
        //make connection
        connectToDB();
        return await User.findOne({id:userId})

    }catch(error:any){
        throw new Error(`Failed to fetch user: ${error.message}`)
    }

}

//to fetch the comments on the thread
export async function fetchUserPosts(userId:string) {
    try{
        //connection
        connectToDB();

        //TODO:Populate community

        //find all thread authored by user with the given user id
        const threads=await User.findOne({id:userId})
        .populate({
            path:"threads",
            model:Thread,
            populate:{
                path:'children',
                model:Thread,
                populate:{
                    path:'author',
                    model:User,
                    select:'name image id'

                }
            }
        })
        return threads;

    }catch(error:any){
        throw new Error(`Failed to fetch user posts:${error.message}`);
    }
    
}

//fetch all users for search bar
export async function fetchUsers({
    userId,
    searchString="",
    pageNumber=1,
    pageSize=20,
    sortBy="desc"
}:{
    userId:string;
    searchString?:string;
    pageNumber?:number;
    pageSize?:number;
    sortBy?:SortOrder;
}){
    try{
        //make connection
        connectToDB();

        //calculate num of users to skip based on pgNum and pageSize
        const skipAmount=(pageNumber-1)*pageSize;

        //case insensitive regex to handle users search
        //i-->indicates case insensitive
        const regex=new RegExp(searchString,"i");


        //initial query to get user form User model DB
        const query:FilterQuery<typeof User>={
            id:{$ne:userId}//display all the member which enter by user except him
        };
    
        //if entered name is not empty
        //fetched
        if(searchString.trim()!==""){
            query.$or=[
                //search either by original name or username
                {username:{$regex:regex}},
                {name:{$regex:regex}}

            ]
        }
        

        //sorting
        const sortOptions={createdAt:sortBy};

        const userQuery=User.find(query)
        .sort(sortOptions)
        .skip(skipAmount)
        .limit(pageSize)

        //to get total exixting user in that name
        const totalUsersCount=await User.countDocuments(query);

        const users=await userQuery.exec();

        const isNext=totalUsersCount>skipAmount+users.length;

        return {users,isNext};



    }catch(error:any){
        throw new Error(`Failed to fetch Users:${error.message}`);
    }
}

//for activity status page
export async function getActivity(userId:string){
    try{
        //connection
        connectToDB();

        //find all threads created by user
        const userThreads=await Thread.find({author:userId});

        //collect all child thread ids(i.e replies or comments to that thread)
        const childThreadIds=userThreads.reduce((acc,userThread)=>{
            return acc.concat(userThread.children);
        },[]);

        console.log(childThreadIds);
        //get acces to all of replies excluding once created by same user
        const replies=await Thread.find({
            _id:{$in:childThreadIds},
            author:{$ne:userId}
        }).populate({
            path:'author',
            model:User,
            select:'name image _id'
        });
        return replies;
        


    }catch(error:any){
        throw new Error(`Failed to fetch activity:${error.message}`)
    }
}
