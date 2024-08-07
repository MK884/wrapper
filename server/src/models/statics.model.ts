import mongoose from 'mongoose';

const StaticSchema = new mongoose.Schema(
    {
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            index: true,
        },
        projectType: {
            type:String,
            enum:["Url", "Profile", "QR"],
            required:true
        },
        city: {
            type: String,   
        },
        country: {
            type: String,
        },
        region: {
            type: String,
        },
        device: {
            type: String,
            enum: ['console','mobile' , 'tablet' , 'smarttv' , 'wearable' , 'embedded' , 'desktop']
        },
    },
    { timestamps: true }
);


const Static = mongoose.model('Static', StaticSchema);

export default Static;
