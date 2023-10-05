import ThreadCard from "@/components/cards/ThreadCard";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Comment from "@/components/forms/Comment";


const Page= async ({params}:{params:{id:string}})=>{
    if(!params.id) return null;

    const user= await currentUser();
    if(!user) return null;

    //fetching data from DB
    const userInfo=await fetchUser(user.id);

    //if he doesnt have details he have to go to onboarding to create an acc
    if(!userInfo?.onboarded) redirect('/onboarding');

    //fetching the threads
    const thread=await fetchThreadById(params.id);
   return(
        <section className="relative">
            <div>
                <ThreadCard
                    key={thread._id}
                    id={thread._id}
                    currentUserId={user?.id || ""}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={thread.author}
                    community={thread.community}
                    createdAt={thread.createdAt}
                    comments={thread.children}
                />

            <div className="mt-7">
                <Comment
                    threadId={thread.id}
                    currentUserImg={userInfo.image}
                    currentUserId={JSON.stringify(userInfo._id)}
                />
            </div>

            {/*to display the comments below the thread*/}
            <div className="mt-10">
            {thread.children.map((items: any) => (
                <ThreadCard
                    key={items._id}
                    id={items._id}
                    currentUserId={items?.id || ""}
                    parentId={items.parentId}
                    content={items.text}
                    author={items.author}
                    community={items.community}
                    createdAt={items.createdAt}
                    comments={items.children}
                    isComment={true}
                />
            ))}

            </div>


        </div>
    </section>
   )

};
export default Page;