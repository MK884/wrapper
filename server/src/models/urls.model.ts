import mongoose, { Document } from 'mongoose';

const UrlSchema = new mongoose.Schema(
    {
        originalUrl: {
            type: String,
            required: true,
        },
        shortUrl: {
            type: String,
            required: true,
            unique: true
        },
        customUrl: {
            type: String,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required:true
        },
        title: {
            type: String,
        },
        description: {
            type: String,
        },
        image: {
            type: String,
        },
        domainIcon: {
            type: String,
        },
        isCustomized:{
            type:Boolean,
            default:false,
        },
        domain:{
            type:String
        }
    },
    { timestamps: true }
);

const Url = mongoose.model('Url', UrlSchema);
export default Url
