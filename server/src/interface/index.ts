import { CookieOptions, Request } from "express";


export interface userToken {
    _id: string;
    email:string
}


export interface CustomeRequest extends Request {
    files?: {
        [fieldname: string]: Express.Multer.File[] ;
    };
    user?:any
}


export const cookieOpt:CookieOptions= {
    httpOnly:true,
    secure:true,
    sameSite:'none',
}