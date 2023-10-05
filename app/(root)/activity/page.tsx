import { fetchUser, getActivity } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";

async function Page(){
    //who is clicking on comment
    const user=await currentUser();

    //if there no user
    if(!user) return null;

    //in which user profile user clicked in comment section
    const userInfo=await fetchUser(user.id);

    //suppose there is no id for current user he have to make a account so redirect
    if(!userInfo?.onboarded) redirect('/onboarding');

    //get Activity
    const activities= await getActivity(userInfo._id);
    return(
        <section>
            <h1 className="head-text">Activity</h1>
            <section className="mt-10 flex flex-col gap-5">
                {activities && activities.length>0?(
                    <>
                        {activities.map((activity)=>(
                                <Link key={activity._id}
                                    href={`/thread/${activity.parentId}`}
                                >
                                    <article className="activity-card">
                                        <Image
                                            src={activity.author.image}
                                            alt="Profile Picture"
                                            width={20}
                                            height={20}
                                            className="rounded-full object-cover"
                                        />
                                        <p className="text-small-regular text-light-1">
                                            <span className="mr-1 text-primary-500">
                                                {activity.author.name}
                                            </span>
                                            replies to your post
                                        </p>

                                    </article>
                                </Link>

                        ))}

                    </>
                ):(
                    <p className="text-base-regular text-light-3">No Activity Yet...</p>

                )}

            </section>
        </section>
    )
};
export default Page;