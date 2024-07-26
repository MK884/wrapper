import { Request } from "express";


export interface userToken {
    _id: string;
    email:string
}


export interface CustomeRequest extends Request {
    files?: {
        [fieldname: string]: Express.Multer.File[] ;
    };
    user?:userToken
}


interface cookieOptions {
    httpOnly:boolean;
    secure: boolean;
}

export const cookieOpt:cookieOptions = {
    httpOnly:true,
    secure:true
}