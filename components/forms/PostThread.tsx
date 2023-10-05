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
import { Textarea } from "@/components/ui/textarea"

//to store data in the form
import { useForm } from "react-hook-form";

//TypeScript-first schema validation
import * as z from 'zod';
import {zodResolver} from "@hookform/resolvers/zod";

//to get path
import {usePathname, useRouter} from 'next/navigation';

//for validating thread and comments
import { ThreadValidation } from "@/lib/validations/thread";
import { createThread } from "@/lib/actions/thread.actions";


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
};

function PostThread({userId}:{userId:string}){
  
    
    //for navigation
    const router=useRouter();
    const pathname=usePathname();
    //forms
    const form=useForm({
        resolver:zodResolver(ThreadValidation),
        defaultValues:{
           thread:'',
           accountId: userId
        }
});

//submit handler
const onSubmit=async(values:z.infer<typeof ThreadValidation>)=>{
    await createThread({
        text : values.thread,
        author:userId,
        communityId:null,
        path:pathname

    });

    //move to home once submited
    router.push('/');

};

return (
    <Form {...form}>

        <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="mt-10 flex flex-col justify-start gap-1"
        >
            <FormField
                control={form.control}
                name="thread"
                render={({ field }) => (
                    <FormItem className="felx gap-3 w-full">


                        <FormLabel className="text-base-semibold text-light-2">
                            Content
                        </FormLabel>

                    <FormControl>
                <Textarea
                    className="no-focus border border-dark-4 bg-dark-3 text-light-1"
                    rows={15}
                    {...field}
                 />
              </FormControl>
              <FormMessage/>

            </FormItem>
          )}
        />
        <Button 
            type="submit"
            className="bg-primary-500"
        >
            Post
        </Button>
        </form>

        </Form>
    )
};
export default PostThread;