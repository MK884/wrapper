import mongoose, { Document } from 'mongoose';

const UrlSchema = new mongoose.Schema(
    {
        longUrl: {
            type: String,
            required: true,
        },
        shortUrl: {
            type: String,
        },
        customUrl: {
            type: String,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true }
);

export const Url = mongoose.model('Url', UrlSchema);
