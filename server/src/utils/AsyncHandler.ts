import { NextFunction, Request, Response } from "express";

const asyncHandler  = (reqHandler:Function) => {
    return ( req: Request, res: Response, next: NextFunction ) => {
        Promise.resolve(reqHandler(req, res, next)).catch(next);
    }
};


export { asyncHandler }