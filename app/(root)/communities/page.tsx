import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { fetchCommunities } from "@/lib/actions/community.actions";
import CommunityCard from "@/components/cards/CommunityCard";

async function Page(){
    //who is clicking on comment
    const user=await currentUser();

    //if there no user
    if(!user) return null;

    //in which user profile user clicked in comment section
    const userInfo=await fetchUser(user.id);

    //suppose there is no id for current user he have to make a account so redirect
    if(!userInfo?.onboarded) redirect('/onboarding');

    //fetch all communities
    const result=await fetchCommunities({
        searchString:"",
        pageNumber:1,
        pageSize:25
    })


    return(
        <section>
            <h1 className="head-text">Search</h1>

            {/* search bar TODO*/}

            <div className="mt-14 flex flex-col gap-9">
            {result.communities.length === 0 ? (
                <p className="no-result">No users</p>
            ) : (
                <>
                    {result.communities.map((community) => (
                    <CommunityCard
                        key={community.id}
                        id={community.id}
                        name={community.name}
                        username={community.username}
                        imgUrl={community.image}
                        bio={community.bio}
                        members={community.members}     
                    />
                    ))}
                </>
            )}

            </div>
        </section>
    )
};
export default Page;