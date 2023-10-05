"use client"

//it is created after shadcn setup
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
  } from "@/components/ui/form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image";
//to store data in the form
import { useForm } from "react-hook-form";

//TypeScript-first schema validation
import * as z from 'zod';
import {zodResolver} from "@hookform/resolvers/zod";
import { UserValidation } from "@/lib/validations/user";
import { ChangeEvent, useState } from "react";


import { isBase64Image } from "@/lib/utils"
import {useUploadThing} from '@/lib/uploadthing';
import { updateUser } from "@/lib/actions/user.actions"

//to get path
import {usePathname, useRouter} from 'next/navigation';

interface Props{
    user:{
        id:string;
        objectId:string;
        username:string;
        name:string;
        bio:string;
        image:string;

    };
    btnTitle:string;
}
const AccountProfile=({user,btnTitle}:Props)=>{
    //for image
    const [files,setFiles]=useState<File[]>([]);
    //for changing the image in db after updating 
    const {startUpload}=useUploadThing("media");
    
    //for navigation
    const router=useRouter();
    const pathname=usePathname();
    const form=useForm({
        resolver:zodResolver(UserValidation),
        defaultValues:{
            profile_photo:user?.image||'',
            name: user?.name||'',
            username:user?.username||'',
            bio:user?.bio || ''
        }
    });

    //handling uploading images event
    const handleImage=(e:ChangeEvent<HTMLInputElement>,fieldChange:(value:string)=>void)=>{
        const fileReader=new FileReader();

        if(e.target.files && e.target.files.length>0){
            const file=e.target.files[0];

            setFiles(Array.from(e.target.files));

            if(!file.type.includes('image')) return;

            fileReader.onload=async (event)=>{
                const imageDataUrl=event.target?.result?.toString() || '';

                //update it
                fieldChange(imageDataUrl);
            };
            fileReader.readAsDataURL(file)
        }
      
    }

    //submiting form event
    const onSubmit=async (values:z.infer<typeof UserValidation>)=>{

        //get value from profile photo
        const blob=values.profile_photo;

        //to know image change or not
        //defined in utils.ts
        const hasImageChanged=isBase64Image(blob);

        //if image changed with help of useUploadthing update the changed img 
        if(hasImageChanged){
            const imgRes=await startUpload(files);

            if(imgRes && imgRes[0].fileUrl){
                //mutate value it take care in backend
                values.profile_photo=imgRes[0].fileUrl;
            }
        }

        //TODO: Update user profile 
        await updateUser({
          userId:user.id,//coming from clerk
          username:values.username,
          name:values.name,
          bio:values.bio,
          image:values.profile_photo,
          path:pathname
        });

        if(pathname==='/profile/edit'){
          router.back(); //after editing goes to previous page
        }else{
          router.push('/'); //goes onboarding to main page
        }
    }


    return(
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-start gap-1">
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className="felx items-center gap-4">


                <FormLabel className="account-form_image-label">
                    {field.value?(
                            <Image 
                                src={field.value}
                                alt="profile photo" 
                                width={96}
                                height={96}
                                priority
                                className="rounded-full object-contain"
                            />
                        ):(
                            <Image 
                                src="/assets/profile.svg"
                                alt="profile photo" 
                                width={24}
                                height={24}
                                className="rounded-full object-contain"
                            />

                        )
                    }
                </FormLabel>

              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input 
                    type="file"
                    accept="image/*"
                    placeholder="Upload a Photo"
                    className="account-form_image-input"
                    onChange={(event)=>handleImage(event,field.onChange)}
                 />
              </FormControl>
              <FormMessage/>

            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="felx gap-3 w-full">


                <FormLabel className="text-base-semibold text-light-2">
                    Name
                </FormLabel>

              <FormControl>
                <Input 
                    type="text"
                    className="account-form_input no-focus"
                    {...field}
                 />
              </FormControl>
              <FormMessage/>

            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="felx items-center gap-3 w-full">


                <FormLabel className="text-base-semibold text-light-2">
                    User Name
                </FormLabel>

              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input 
                    type="text"
                    className="account-form_input no-focus"
                    {...field}
                />
                
              </FormControl>
              <FormMessage/>

            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="felx items-center gap-5 w-full">


                <FormLabel className="text-base-semibold text-light-2">
                   Bio
                </FormLabel>

              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Textarea
                    rows={10}
                    className="account-form_input no-focus"
                    {...field}
                 />
              </FormControl>
              <FormMessage/>

            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-500">Submit</Button>
      </form>
    </Form>
    )
}
export default AccountProfile;