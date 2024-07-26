import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';
import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { User } from '../models';
import { CustomeRequest, userToken } from '../interface';
import { asyncHandler } from '../utils';

const accessTokenSecret =
    process.env.ACCESS_TOKEN_SECRET || 'hdgasuydyaw89dyash';

const jwtVerify = asyncHandler(
    (req: CustomeRequest, res: Response, next: NextFunction) => {
        const cookie =
            req.cookies?.accessToken ||
            req.headers?.authorization ||
            req?.headers?.Authorization;

        const token = cookie?.replace('Bearer ', '');

        if (!token) throw new ApiError(401, 'Unauthorized request');

        try {
            const user = jwt.verify(token, accessTokenSecret) as JwtPayload;

            if (!user) throw new ApiError(403, 'Invalid Access Token');

            req.user = user as userToken;
            next();
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                return res
                    .status(403)
                    .json(new ApiError(403, 'Inavlid Token', error?.message));
            }
        }
    }
);

export default jwtVerify;
