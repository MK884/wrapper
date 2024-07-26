import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { saltOrRounds } from '../constant';
import jwt from 'jsonwebtoken';
import { userToken } from '../interface';

const accessTokenSecret =
    process.env.ACCESS_TOKEN_SECRET || 'hdgasuydyaw89dyash';
const accessTokenExpires = process.env.ACCESS_TOKEN_EXPIRY || '15s';

const refreshTokenSecret =
    process.env.REFRESH_TOKEN_SECRET || 'hdgasuydyaw89dyash';
const refreshTokenExpires = process.env.REFRESH_TOKEN_EXPIRY || '30s';

export interface IUser extends Document {
    fullName:string,
    email:string,
    password:string,
    avatar?:string,
    refreshToken?:string,
    isPasswordCorrect: (password:string) => Promise<boolean>,
    generateAccessToken: Function,
    generateRefreshToken:Function
    
}


const UserSchema:mongoose.Schema<IUser> = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        password: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
        },
        refreshToken: {
            type: String,
        },
    },
    { timestamps: true }
);

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, saltOrRounds);
    next();
});

UserSchema.methods.isPasswordCorrect = async function (passowrd: string) {
    return await bcrypt.compare(passowrd, this.password);
};

UserSchema.methods.generateAccessToken = function () {
    try {
        const userToken:userToken = {
            _id: this._id,
            email: this.email,
        };
        const token = jwt.sign(userToken, accessTokenSecret, {
            expiresIn: accessTokenExpires,
        });

        return token;
    } catch (error) {
        console.error('Error in Generating Access Token: ', error);
        throw error;
    }
};

UserSchema.methods.generateRefreshToken = function () {
    try {
        const token = jwt.sign({ _id: this._id }, refreshTokenSecret, {
            expiresIn: refreshTokenExpires,
        });
        return token;
    } catch (error) {
        console.error('Error in Generating Refresh Token: ', error);
        throw error;
    }
};

const User = mongoose.model<IUser>('User', UserSchema);
export default User
