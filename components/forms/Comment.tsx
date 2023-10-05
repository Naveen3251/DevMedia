"use client"
//it is created after shadcn setup
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
  } from "@/components/ui/form";
import { Button } from "@/components/ui/button"
import Image from "next/image";

//TypeScript-first schema validation
import * as z from 'zod';
import {zodResolver} from "@hookform/resolvers/zod";

//to store data in the form
import { useForm } from "react-hook-form";
//to get path
import {usePathname, useRouter} from 'next/navigation';
import { CommentValidation } from "@/lib/validations/thread";
import { Input } from "../ui/input";
import { addCommentToThread } from "@/lib/actions/thread.actions";

interface Props{
    threadId:string;
    currentUserImg:string;
    currentUserId:string;
};

const Comment=({threadId,currentUserImg, currentUserId}:Props)=>{
    //for navigation
    const router=useRouter();
    const pathname=usePathname();

    //forms
    const form=useForm({
        resolver:zodResolver(CommentValidation),
        defaultValues:{
           thread:'',
        }
    });

    //submit handler
    const onSubmit=async(values:z.infer<typeof CommentValidation>)=>{
        await addCommentToThread(
            threadId,
            values.thread,
            JSON.parse(currentUserId),
            pathname
        );

        form.reset();
    }
    return(
        <Form {...form}>
        <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="comment-form"
        >
            <FormField
                control={form.control}
                name="thread"
                render={({ field }) => (
                    <FormItem className="felx w-full items-center gap-3">
                        <FormLabel>
                            <Image 
                                src={currentUserImg} 
                                alt="Profileimage"
                                height={48}
                                width={48}
                                className="rounded-full"
                            />
                        </FormLabel>

                        <FormControl className="border-none bg-transparent">
                            <Input
                                type="text"
                                placeholder="Comment..."
                                className="no-focus text-light-1 outline-none"
                                {...field}
                        />
                        </FormControl>
                    </FormItem>
          )}
        />
        <Button 
            type="submit"
            className="comment-form_btn"
        >
            Reply
        </Button>
        </form>

        </Form>
    )
};
export default Comment;