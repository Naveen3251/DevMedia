import ProfileHeader from "@/components/shared/ProfileHeader";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Image from "next/image";
//tabs from shadcn
import {Tabs,TabsContent,TabsList,TabsTrigger} from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import ThreadsTab from "@/components/shared/ThreadsTab";

async function Page({params}:{params:{id:string}}){
    //who is clicking on comment
    const user=await currentUser();

    //if there no user
    if(!user) return null;

    //in which user profile user clicked in comment section
    const userInfo=await fetchUser(params.id);

    //suppose there is no id for current user he have to make a account so redirect
    if(!userInfo?.onboarded) redirect('/onboarding');
  return(
    <section>
       <ProfileHeader 
            accountId={userInfo.id}
            authUserId={user.id}
            name={userInfo.name}
            username={userInfo.username}
            imgUrl={userInfo.image}
            bio={userInfo.bio}
       />

       <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
            <TabsList className="tab">
                {/*it is in constant index.js*/}
                {profileTabs.map((tab)=>(
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
                            text-tiny-medium text-light-2">{userInfo?.threads?.length}</p>
                        )}
                    </TabsTrigger>
                ))}
            </TabsList>

            {/* to display comments*/}
            {profileTabs.map((tab)=>(
                <TabsContent key={`content-${tab.value}`} value={tab.value}
                className="w-full text-light-1"
                >
                    <ThreadsTab
                        currentUserId={user.id}
                        accountId={userInfo.id}
                        accountType="User"
                    />

                </TabsContent>
            ))}
            
        </Tabs>
       </div>

    </section>
  )
};
export default Page;