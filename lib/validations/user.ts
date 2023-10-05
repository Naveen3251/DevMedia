import * as z from 'zod';

export const UserValidation=z.object({
    profile_photo:z.string().url().nonempty(),
    name:z.string().min(3,{message:'Minimum 3 Characters'}).max(30,{message:'Maximum 30 Characters Only'}),
    username:z.string().min(3,{message:'Minimum 3 Characters'}).max(30,{message:'Maximum 30 Characters Only'}),
    bio:z.string().min(3).max(1000),

})