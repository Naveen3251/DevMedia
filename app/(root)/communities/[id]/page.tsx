import { currentUser } from "@clerk/nextjs";
import ProfileHeader from "@/components/shared/ProfileHeader";

import Image from "next/image";

//tabs from shadcn
import {Tabs,TabsContent,TabsList,TabsTrigger} from "@/components/ui/tabs";
import { communityTabs } from "@/constants";
import ThreadsTab from "@/components/shared/ThreadsTab";


import { fetchCommunityDetails } from "@/lib/actions/community.actions";
import UserCard from "@/components/cards/UserCard";

async function Page({params}:{params:{id:string}}){
    //who is clicking on comment
    const user=await currentUser();

    //if there no user
    if(!user) return null;

    //gets all of the particular community details where we click
    const communityDetails=await fetchCommunityDetails(params.id)

  return(
    <section>
       <ProfileHeader 
            accountId={communityDetails.id}
            authUserId={user.id}
            name={communityDetails.name}
            username={communityDetails.username}
            imgUrl={communityDetails.image}
            bio={communityDetails.bio}
            type="Community"
       />

       <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
            <TabsList className="tab">
                {/*it is in constant index.js*/}
                {communityTabs.map((tab)=>(
                    <TabsTrigger key={tab.label} value={tab.value} className="tabs" >
                        <Image 
                            src={tab.icon}
                            alt={tab.label}
                            height={24}
                            width={24}
                            className="object-contain"
                        />
                        {/*in mob device threads replies and tagged labels will hidden*/}
                        <p className="max-sm:hidden">{tab.label}</p>

                        {/*count of threads to display*/}
                        {tab.label==="Threads" &&(
                            <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 
                            text-tiny-medium text-light-2">{communityDetails?.threads?.length}</p>
                        )}
                    </TabsTrigger>
                ))}
            </TabsList>

        
                <TabsContent value="threads"
                className="w-full text-light-1"
                >
                    <ThreadsTab
                        currentUserId={user.id}
                        accountId={communityDetails._id}
                        accountType="Community"
                    />

                </TabsContent>

                <TabsContent value="members"
                className="w-full text-light-1"
                >
                   <section className="mt-9 flex flex-col gap-10">
                            {communityDetails?.members.map((member:any)=>{
                                <UserCard
                                    key={member.id}
                                    id={member.id}
                                    name={member.name}
                                    username={member.username}
                                    imgUrl={member.image}
                                    personType="User" //it is user not an community
                                />
                            })}

                   </section>

                </TabsContent>

                <TabsContent value="requests"
                className="w-full text-light-1"
                >
                    <ThreadsTab
                        currentUserId={user.id}
                        accountId={communityDetails._id}
                        accountType="Community"
                    />

                </TabsContent>
            
            
        </Tabs>
       </div>

    </section>
  )
};
export default Page;