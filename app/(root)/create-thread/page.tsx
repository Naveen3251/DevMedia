import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function Page(){
    const user=await currentUser();

    //if there no user
    if(!user) return null;

    //if we have user
    const userInfo=await fetchUser(user.id);

    //suppose there is no id for current user he have to make a account so redirect
    if(!userInfo?.onboarded) redirect('/onboarding');

    return ( 
        <>
            <h1 className="head-text">Create Thread</h1>
            <PostThread userId={userInfo._id}/>
        </>
        
    )
};
export default Page;