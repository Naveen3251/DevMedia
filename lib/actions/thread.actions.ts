"use server"
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"

interface Params{
    text:string,
    author:string,
    communityId:string | null,
    path: string
}
//to add the post(threads)
export async function createThread({text,author,communityId,path}:Params){
    try{
        //make connection
        connectToDB();

        //create it
        const createdThread=await Thread.create({
            text,
            author,
            community:null, 
        });

        //update user model
        await User.findByIdAndUpdate(author,{
            $push:{threads:createdThread._id}
        });

        //used for scenarios where you want to update your cached data without waiting for a revalidate period to expire
        revalidatePath(path);
    }catch(error:any){
        throw new Error(`Error creating thread: ${error.message}`);
    }


};

// to fetch the posts
export async function fetchPosts(pageNumber=1,pageSize=20){
    // Make a connection to the database
    connectToDB();

    // Calculate the number of posts to skip based on the page number and page size
    const skipAmount = (pageNumber - 1) * pageSize;

    // Query to fetch the posts that have no parents (top-level threads, i.e., standalone threads)
    const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: 'desc' })  // Sort the posts by creation date in descending order (latest first)
    .skip(skipAmount)             // Skip a certain number of posts based on the page and page size
    .limit(pageSize)              // Limit the number of posts per page
    .populate({                   // Populate the "author" field with user documents
    path: 'author',
    model: User
    })
    .populate({                   // Populate the "children" field with thread documents and author details
    path: 'children',
    populate: {
      path: 'author',
      model: User,
      select: "_id name parentId image"  // Select specific fields from the user document
    }
    });

    // Get the total count of posts that match the query (standalone threads)
    const totalPostsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined] } });

    // Execute the query and fetch the posts
    const posts = await postsQuery.exec();

    // Calculate whether there are more posts to be fetched on the next page
    const isNext = totalPostsCount > skipAmount + posts.length;

    // Return the fetched posts and the flag indicating if there are more posts to fetch
    return { posts, isNext };



};

// to fetch the thread w.r.t id
export async function fetchThreadById(id:string){
    //connection
    connectToDB();
    try{

        //TODO: Populate community
        const thread=await Thread.findById(id)
        .populate({
            path:'author',
            model:User,
            select:'_id id name image'
        })
        .populate({
            path:'children',
            populate:[
                {
                    path:'author',
                    model:User,
                    select:"_id id name parentId image"
                },
                {
                    path:'children',
                    model:Thread,
                    populate:{
                        path:'author',
                        model:User,
                        select:"_id id name parentId image"
                    }
                }
            ]
        }).exec();
        return thread;

    }catch(error:any){
        throw new Error(`Error creating thread: ${error.message}`)
    }
};

//comment section for the standalone threads
export async function addCommentToThread(
    threadId:string,
    commentText:string,
    userId:string,
    path:string

){
    //connection
    connectToDB();

    //adding a comment
    try{
        //find original thread by its id
        const originalThread=await Thread.findById(threadId);

        //if there is no thread
        if(!originalThread){
            throw new Error("Thread not found");
        }

        //create new thread with comment text
        //from the model Thread is instance
        const commentThread=new Thread({
            text:commentText,
            author:userId,
            parentId:threadId
        });

        //save the new thread
        const savedCommentThread=await commentThread.save();

        //Update the original thread to include new comment
        originalThread.children.push(savedCommentThread._id);

        //save the original thread
        await originalThread.save();

        revalidatePath(path);

    }catch(error:any){
        throw new Error(`Error creating thread: ${error.message}`)
    }
}