import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import UserCard from "@/components/cards/UserCard";

async function Page(){
    //who is clicking on comment
    const user=await currentUser();

    //if there no user
    if(!user) return null;

    //in which user profile user clicked in comment section
    const userInfo=await fetchUser(user.id);

    //suppose there is no id for current user he have to make a account so redirect
    if(!userInfo?.onboarded) redirect('/onboarding');

    //fetch all users
    const result=await fetchUsers({
        userId:user.id,
        searchString:"",
        pageNumber:1,
        pageSize:25
    })


    return(
        <section>
            <h1 className="head-text">Search</h1>

            {/* search bar TODO*/}

            <div className="mt-14 flex flex-col gap-9">
            {result.users.length === 0 ? (
                <p className="no-result">No users</p>
            ) : (
                <>
                    {result.users.map((person) => (
                    <UserCard
                        key={person.id}
                        id={person.id}
                        name={person.name}
                        username={person.username}
                        imgUrl={person.image}
                        personType='User'
                    />
                    ))}
                </>
            )}

            </div>
        </section>
    )
};
export default Page;