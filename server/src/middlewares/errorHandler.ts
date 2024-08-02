import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils";

export const errorHandler = (err:any,req:Request, res:Response, next:NextFunction)=>{
    if(err instanceof ApiError){
        return res.status(err?.statusCode).json({
            success: err?.sucess,
            message: err?.message,
            errors:err?.error
        })
    }

    return res.status(500).json({
        success:false,
        message:"Server internal error"
    })
}