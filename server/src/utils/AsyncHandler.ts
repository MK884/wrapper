import { Request, Response } from "express";

export const AsyncHandler = (reqHandler: Function) => {
    return (req: Request, res: Response, next: Function) => {
        Promise.resolve(reqHandler(req, res, next)).catch((error) =>
            next(error)
        );
    };
};
