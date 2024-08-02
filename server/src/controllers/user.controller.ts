import { Request, Response } from 'express';
import { cookieOpt, CustomeRequest } from '../interface';
import {
    ApiError,
    ApiResponse,
    asyncHandler,
    deleteSingleAsset,
    uploadOnCloudinary,
} from '../utils';
import { z } from 'zod';
import { User } from '../models';
import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken';

const refreshTokenSecret =
    process.env.REFRESH_TOKEN_SECRET || 'hdgasuydyaw89dyash';

interface userStructure {
    email: string;
    fullName: string;
    avatar?: string;
}

const registerSchema = z.object({
    fullName: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

type loginStructure = z.infer<typeof loginSchema>;

const register = asyncHandler(async (req: CustomeRequest, res: Response) => {
    const userInput = registerSchema.safeParse(req.body);

    // validation
    if (!userInput?.success) {
        return res.status(400).json(
            new ApiError(
                400,
                'Validation failed',
                userInput?.error?.issues.map((issue) => ({
                    path: issue?.path,
                    message: issue?.message,
                }))
            )
        );
    }

    const { email, fullName, password } = userInput?.data;

    const avatarLocalPath = req?.file?.path;

    const [isExist, avatar] = await Promise.all([
        User.findOne({ email }),
        avatarLocalPath ? uploadOnCloudinary(avatarLocalPath) : null,
    ]);

    if (isExist) throw new ApiError(406, 'Email already Registered');

    if (avatarLocalPath && !avatar?.url)
        throw new ApiError(500, 'Somthing went wrong while uploading avatar');

    const user = await User.create({
        email,
        fullName,
        password,
        avatar: avatar?.url,
    });

    const userData: userStructure = {
        email: user.email,
        avatar: user?.avatar ?? undefined,
        fullName: user?.fullName,
    };

    return res
        .status(200)
        .json(new ApiResponse(200, 'successfully register user', userData));
});

const login = asyncHandler(async (req: CustomeRequest, res: Response) => {
    console.log(req.body);

    const userInput = loginSchema.safeParse(req.body);

    if (!userInput?.success) {
        return res.status(400).json(
            new ApiError(
                400,
                'Validation failed',
                userInput?.error?.issues?.map((issue) => ({
                    path: issue?.path,
                    message: issue?.message,
                }))
            )
        );
    }

    const { email, password } = userInput?.data as loginStructure;

    const userDB = await User.findOne({ email });

    if (!userDB) {
        throw new ApiError(
            404,
            'This email does not exist, please try to register'
        );
    }

    const validatePassword = await userDB?.isPasswordCorrect(password);

    if (!validatePassword)
        throw new ApiError(403, 'incorrect user credentials');

    const accessToken = userDB?.generateAccessToken();
    const refreshToken = userDB?.generateRefreshToken();

    if (!accessToken || !refreshToken)
        throw new ApiError(500, 'Somthing went wrong while generating tokens');

    userDB.refreshToken = refreshToken;
    await userDB.save({ validateBeforeSave: false });

    return res
        .status(200)
        .cookie('accessToken', accessToken, cookieOpt)
        .cookie('refreshToken', refreshToken, cookieOpt)
        .json(
            new ApiResponse(200, 'Login successful', {
                userDetails: {
                    accessToken,
                    email: userDB.email,
                    avatar: userDB?.avatar || undefined,
                    fullName: userDB?.fullName,
                },
            })
        );
});

const logout = asyncHandler(async (req: CustomeRequest, res: Response) => {
    const userId = req?.user?._id;

    await User.findByIdAndUpdate(
        userId,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        {
            new: true,
        }
    );

    return res
        .status(202)
        .clearCookie('accessToken', cookieOpt)
        .clearCookie('refreshToken', cookieOpt)
        .json(new ApiResponse(202, 'Successfully logged out'));
});

const refreshAccessToken = asyncHandler(
    async (req: CustomeRequest, res: Response) => {
        const incomingRefreshToken = req.cookies?.refreshToken;

        if (!incomingRefreshToken)
            throw new ApiError(401, 'Unautherized Request from Server');

        try {
            const userClaims = jwt.verify(
                incomingRefreshToken,
                refreshTokenSecret
            ) as JwtPayload;

            const user = await User.findById(userClaims._id);

            if (!user) throw new ApiError(404, 'User not found');

            if (incomingRefreshToken !== user?.refreshToken)
                throw new ApiError(403, 'Invalid refresh token');

            const accessToken = user?.generateAccessToken();
            const refreshToken = user?.generateRefreshToken();

            user.refreshToken = refreshToken;

            await user.save({ validateBeforeSave: false });

            return res
                .status(200)
                .cookie('accessToken', accessToken, cookieOpt)
                .cookie('refreshToken', refreshToken, cookieOpt)
                .json(new ApiResponse(200, 'success', { accessToken }));
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                return res
                    .status(403)
                    .json(new ApiError(403, 'Invalid Token', error));
            }
            return res.json(new ApiError(500, 'somthing went wrong'));
        }
    }
);

const updateAvatar = asyncHandler(
    async (req: CustomeRequest, res: Response) => {
        const newAvatarLocalPath = req?.file?.path;

        console.log(newAvatarLocalPath);
        

        if (!newAvatarLocalPath)
            throw new ApiError(404, 'New avatar not found');

        const currentuser = await User.findById(req?.user?._id);

        if (!currentuser) throw new ApiError(404, 'User not found');

        const avatar = await uploadOnCloudinary(newAvatarLocalPath);

        if (!avatar?.url) throw new ApiError(500, 'Failed to upload avatar');

        let oldAvatarPunlicUrl = currentuser?.avatar;

        if (oldAvatarPunlicUrl) {
            const respnse = await deleteSingleAsset(oldAvatarPunlicUrl);
            if (!respnse) console.error('Failed to delete');
        }

        const result = await User.findByIdAndUpdate(
            req?.user?._id,
            {
                $set: {
                    avatar: avatar?.url,
                },
            },
            {
                new: true,
            }
        ).select('avatar');

        if (!result) throw new ApiError(500, 'Failed to save new avatar');

        return res
            .status(200)
            .json(new ApiResponse(200, 'Success', { avatar: result }));
    }
);

const updateUser = asyncHandler(async (req: CustomeRequest, res: Response) => {
    const { fullName, email } = req?.body;
    if (!(fullName || email))
        throw new ApiError(400, 'At least one field must be provided');

    const updateUserDetails: { [key: string]: string } = {};
    if (email) updateUserDetails.email = email;
    if (fullName) updateUserDetails.fullName = fullName;

    const updatedUser = await User.findByIdAndUpdate(
        req?.user?._id,
        {
            $set: updateUserDetails,
        },
        {
            new: true,
        }
    );

    const user = {
        email: updatedUser?.email,
        fullName: updatedUser?.fullName,
    };

    return res.status(200).json(new ApiResponse(200, 'User updated', user));
});


const deleteUser = asyncHandler( async (req:CustomeRequest, res:Response) =>{
    const UserId = req?.user?._id;
    
    const user = await User.findById(UserId);

    if(!user) throw new ApiError(404, "No User to delete");

    const deletedUser = await User.findByIdAndDelete(user?._id);

    if(deleteUser === null) throw new ApiError(500,"DB Error");

    await deleteSingleAsset(user?.avatar!);
    
    return res
    .status(202)
    .json(new ApiResponse(200, 'User deleted', deletedUser))

})

export {
    register,
    login,
    logout,
    refreshAccessToken,
    updateAvatar,
    updateUser,
    deleteUser
};
