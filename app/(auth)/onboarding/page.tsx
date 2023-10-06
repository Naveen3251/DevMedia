import AccountProfile from "@/components/forms/AccountProfile";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function Page(){
    //used to fetch info of current user which is in clerk
    
    const user=await currentUser();
    if(!user) return null;

    //fetch the user from DB
    const userInfo=await fetchUser(user.id);
    //already onboarded
    if(userInfo?.onboarded) return redirect('/');

    const userData={
        id:user?.id,
        objectId:userInfo?._id,
        username:userInfo? userInfo?.username : user?.username,
        name:userInfo? userInfo?.name : user?.firstName||"",
        bio:userInfo? userInfo?.bio : "",
        image:userInfo? userInfo?.image : user?.imageUrl
    }

    return(
        
        <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
            <h1 className="head-text">Onboarding</h1>
            <p className="mt-3 text-base-regular text-light-2">
                Complete Your Profile Now To Use Dev-Media
            </p>
            <section className="mt-9 bg-dark-2 p-10">
                <AccountProfile 
                user={userData}
                btnTitle="Continue"
                />
            </section>
        </main>
    )
    
};
export default Page;