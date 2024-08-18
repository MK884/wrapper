import { Request, Response } from 'express';
import { CustomeRequest, DeviceType } from '../interface';
import {
    ApiError,
    ApiResponse,
    asyncHandler,
    deleteSingleAsset,
    generateQrCod,
    uploadOnCloudinary,
} from '../utils';
import { country, GOOGLE_FAVICON_URL } from '../constant';
import parse from 'node-html-parser';
import he from 'he';
import { Static, Url, User } from '../models';
import { UAParser } from 'ua-parser-js';
import mongoose from 'mongoose';

const isValidUrl = (url: string): boolean => {
    try {
        let parseUrl = new URL(url);
        return (
            parseUrl?.protocol === 'https:' &&
            !parseUrl.hostname.includes('localhost') &&
            parseUrl.hostname !== '127.0.0.1'
        );
    } catch (error) {
        return false;
    }
};

const getDomainOfUrl = (urlString: string) => {
    try {
        const url = new URL(urlString);
        const host = url.hostname;
        if (host === 'youtu.be') return 'youtube.com';
        if (host.endsWith('.vercel.app')) return 'vercel.app';
        if (host === 'raw.githubusercontent.com') return 'github.com';
        if (host === 'images.unsplash.com') return 'unsplash.com';
        if (host === 'projects.100xdevs.com') return '100xdevs.com';
        if (host === 'app.eraser.io') return 'eraser.io';
        return host;
    } catch (error) {
        console.error(error);
        return null;
    }
};

const getReletaviePath = (url: string, imageUrl: string | undefined) => {
    if (!imageUrl) return null;

    if (isValidUrl(imageUrl)) return imageUrl;

    const { host, protocol } = new URL(url);

    let base_url = `${protocol}//${host}`;

    return new URL(imageUrl, base_url).toString();
};

const generateShortUrl = (userId: string): string => {
    let randomString = Math.random().toString(36).substring(2, 6);
    let last4Digits = userId.slice(-4);
    return randomString + last4Digits;
};

const getCountryNameByCode = (code: string): string => {
    let countryCode = code.toUpperCase();
    const countryName = country[countryCode];

    return countryName ? countryName : 'Unknown Country';
};

const getMetaData = asyncHandler(async (req: CustomeRequest, res: Response) => {
    const { url } = req?.body;

    if (!url) throw new ApiError(400, 'URl not provided');

    if (!isValidUrl(url)) throw new ApiError(404, 'URL is not valid');

    const response = await fetch(url, {
        headers: { 'User-Agent': 'Wrapper Bot' },
    });

    const htmlContent = await response.text();

    if (!htmlContent) {
        return res.status(200).json(
            new ApiResponse(200, 'No html Found', {
                title: url,
                description: 'No description',
                image: null,
            })
        );
    }

    const ast = parse(htmlContent);

    const metaTags = ast.querySelectorAll('meta').map(({ attributes }) => {
        const property =
            attributes.property || attributes.name || attributes.href;

        return {
            property,
            content: attributes.content,
        };
    });

    const titleTag = ast.querySelector('title')?.innerText;

    const linkTags = ast.querySelectorAll('link').map(({ attributes }) => {
        const { rel, href } = attributes;

        return { rel, href };
    });

    const MetaData: { [key: string]: any } = {};

    for (let k in metaTags) {
        const { content, property } = metaTags[k];

        property &&
            !MetaData[property] &&
            (MetaData[property] = content && he.decode(content));
    }

    for (let m in linkTags) {
        const { rel, href } = linkTags[m];

        rel && !MetaData[rel] && (MetaData[rel] = href && href);
    }

    const domain = getDomainOfUrl(url);

    const domainIcon = `${GOOGLE_FAVICON_URL}${domain}`;

    const title = titleTag;
    MetaData['og:title'] || MetaData['title'] || MetaData['twitter:title'];

    const description =
        MetaData['og:description'] ||
        MetaData['og:description'] ||
        MetaData['twitter:description'];

    const banner =
        MetaData['image'] ||
        MetaData['og:image'] ||
        MetaData['og:image:url'] ||
        MetaData['og:image_src'] ||
        MetaData['twitter:image'] ||
        MetaData['icon'] ||
        MetaData['shortcut icon'] ||
        MetaData['apple-touch-icon'];

    const keywords = MetaData['og:keywords'] || MetaData['keywords'];

    const originalUrl = MetaData['og:url'] || url;

    const siteName =
        MetaData['og:site_name'] ||
        MetaData['og:application_name'] ||
        MetaData['application-name'];

    return res.status(200).json(
        new ApiResponse(200, 'Successfully fetched metaData', {
            domainIcon,
            title: title || url,
            description: description || 'No description available',
            banner: getReletaviePath(url, banner),
            keywords,
            originalUrl,
            siteName,
            domain,
        })
    );
});

const getShortLink = asyncHandler(
    async (req: CustomeRequest, res: Response) => {
        const { originalUrl, title, description, image } = req?.body;
        const imageFileLocalPath = req?.file?.path;

        const user = req?.user;
        const userId = user?._id;

        if (!originalUrl || originalUrl === '')
            throw new ApiError(404, 'Original url not provided');

        if (!isValidUrl(originalUrl)) throw new ApiError(400, 'Invalid url');

        const shortUrl = generateShortUrl(userId.toString());
        // const base_url = `${req.protocol}://${req.get('host')}`;

        const domain = getDomainOfUrl(originalUrl);
        const domainIcon = `${GOOGLE_FAVICON_URL}${domain}`;

        const data: { [key: string]: any } = {};

        data.originalUrl = originalUrl;
        data.shortUrl = shortUrl;
        data.domain = domain;
        data.domainIcon = domainIcon;
        data.owner = userId;

        if (!title) {
            // there is no changes in preview

            try {
                const response = await Url.create(data);

                if (!response)
                    throw new ApiError(500, 'not able to create shortUrl');

                return res.status(200).json(
                    new ApiResponse(200, 'Created ShortUrl', {
                        shortUrl: shortUrl,
                    })
                );
            } catch (error) {
                throw new ApiError(500, 'Somthing wrong with mongoDb', error);
            }
        } else {
            // here we have some changes in preview

            data.isCustomized = true;
            data.title = title;
            data.description = description;

            // check if user give url or upload the image for banner
            if (imageFileLocalPath) {
                let publicUrl = await uploadOnCloudinary(imageFileLocalPath);
                if (!publicUrl)
                    throw new ApiError(
                        500,
                        'Somthing wrong with uploading on cloudinary'
                    );
                data.image = publicUrl?.url;
            } else {
                if (isValidUrl(image)) {
                    data.image = image;
                } else {
                    throw new ApiError(405, 'Image url is not valid', image);
                }
            }

            try {
                const response = await Url.create(data);

                if (!response)
                    throw new ApiError(500, 'not able to create shortUrl');

                return res.status(200).json(
                    new ApiResponse(200, 'Created ShortUrl', {
                        shortUrl: shortUrl,
                    })
                );
            } catch (error) {
                console.error(error);

                throw new ApiError(500, 'Somthing wrong with mongoDb', error);
            }
        }
    }
);

const shortUrl = asyncHandler(async (req: Request, res: Response) => {
    const { shortUrl } = req?.query;

    if (!shortUrl)
        return res
            .status(404)
            .json(new ApiError(404, 'shortUrl not speciefied'));

    const result = await Url.findOne({ shortUrl });

    if (!result) return res.sendStatus(404);

    const clientIp =
        req.headers['x-real-ip'] ||
        req.headers['x-forwarded-for'] ||
        req.socket.remoteAddress ||
        req.ip;

    console.log('IP => ', clientIp);

    const uaParser = new UAParser(req.headers['user-agent']);
    const parser = uaParser.getDevice();
    const clientDevice: DeviceType = (parser.type as DeviceType) || 'desktop';

    let ipInfo;

    // TODO: clear comments whenever project ready to use in production, for development use dumy data
    // try {
    //     ipInfo = await axios.get(
    //         `https://ipinfo.io/?token=${process.env.IPINFO_API_KEY}`
    //     );
    //     console.log(ipInfo);

    // } catch (error) {
    //     console.error(error);
    // }

    // // just setting empty if not found to avoid any error
    // const clientCity = ipInfo?.data?.city ?? '';
    // const clientRegion = ipInfo?.data?.region ?? '';
    // const clientCountryCode = ipInfo?.data?.country ?? ''; //here we get only country code need to convert it into full name;
    // const clientCountryName = getCountryNameByCode(clientCountryCode);

    const clientCity = 'Mumbai';
    const clientRegion = 'Maharashtra';
    const clientCountryCode = 'IN';
    const clientCountryName = getCountryNameByCode(clientCountryCode);

    try {
        await Static.create({
            projectId: result._id,
            projectType: 'Url',
            city: clientCity,
            region: clientRegion,
            country: clientCountryName,
            device: clientDevice,
        });
    } catch (error) {
        console.error(error);
    }

    if (result?.isCustomized) {
        return res.render('index', { result });
    } else {
        return res.redirect(result.originalUrl);
    }
});

const getAllShortUrlOfUser = asyncHandler(
    async (req: CustomeRequest, res: Response) => {
        const userId = req?.user?._id;
        // page,limit,search => query

        const { page, limit, search } = req.query;

        let currentPage = Number(page) || 0;
        let docLimit = Number(limit) || 10;
        let searchDoc = search || '';

        try {
            const response = await Url.aggregate([
                {
                    $match: {
                        owner: new mongoose.Types.ObjectId(userId),
                        $or: [
                            {
                                shortUrl: { $regex: searchDoc, $options: 'i' },
                            },
                            {
                                originalUrl: {
                                    $regex: searchDoc,
                                    $options: 'i',
                                },
                            },
                        ],
                    },
                },
                {
                    $lookup: {
                        from: 'statics',
                        localField: '_id',
                        foreignField: 'projectId',
                        as: 'statics',
                        pipeline: [
                            {
                                $project: {
                                    updatedAt: 1,
                                    projectType: 1,
                                },
                            },
                        ],
                    },
                },
                {
                    $addFields: {
                        clicks: {
                            $size: '$statics',
                        },
                    },
                },
                {
                    $skip: currentPage * docLimit,
                },
                {
                    $limit: docLimit,
                },
                {
                    $sort: { clicks: -1 },
                },
                {
                    $project: {
                        statics: 0,
                    },
                },
            ]);

            if (!response) throw new ApiError(404, 'No data found');

            const total = await Url.find({ owner: userId }).countDocuments();

            return res
                .status(200)
                .json(new ApiResponse(200, 'Success', { total, response }));
        } catch (error) {
            throw new ApiError(500, 'MongoDb Error: ', error);
        }
    }
);

const getAllStaticsByProjectId = asyncHandler(
    async (req: CustomeRequest, res: Response) => {
        const projectId = req?.query?.projectId;

        if (!projectId) throw new ApiError(404, 'projectId not found');

        // aggregate throw error if not match id found
        const response = await Url.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(projectId.toString()),
                },
            },
            {
                $lookup: {
                    from: 'statics',
                    localField: '_id',
                    foreignField: 'projectId',
                    as: 'statics',
                },
            },
            {
                $addFields: {
                    clicks: {
                        $size: '$statics',
                    },
                },
            },
        ]);

        if (!response.length) throw new ApiError(404, 'No stats available');

        return res.status(200).json(new ApiResponse(200, 'OK', response[0]));
    }
);

const deleteUrl = asyncHandler(async (req: CustomeRequest, res: Response) => {
    // get projectId and verify project and validation
    // delete url and its statistics
    // if url have cloudinary image delete themselves

    const userId = new mongoose.Types.ObjectId(req.user._id);

    const { projectId } = req?.params;

    if (!projectId) throw new ApiError(404, 'No projectId available');

    // need to verify the project owner is same or not
    const UrlOwner = await Url.findById(projectId).select('owner');

    if (!UrlOwner) throw new ApiError(404, 'Project Not Found');

    if (UrlOwner.owner.equals(userId)) {
        const UrlData = await Url.findByIdAndDelete(projectId);

        let imageUrl = UrlData?.image;

        if (imageUrl?.startsWith('http://res.cloudinary.com/backendmk')) {
            // need to delete image on cloudinary
            try {
                await deleteSingleAsset(imageUrl);
            } catch (error) {
                console.error('error in deleting image', error);
            }
        }

        const response = await Static.deleteMany({ projectId: projectId });

        if (!response) console.log('No Static to Delete', response);

        return res.status(200).json(new ApiResponse(200, 'Deleted Url Data'));
    } else {
        throw new ApiError(402, 'Access denied');
    }
});

const editUrl = asyncHandler(async (req: CustomeRequest, res: Response) => {
    const projectId = req?.params?.projectId;

    if (!projectId) throw new ApiError(404, 'ProjectId must be provided');

    const { originalUrl, title, description, image } = req?.body;
    const imageFileLocalPath = req?.file?.path;

    const bodyData =
        originalUrl || title || description || image || imageFileLocalPath;

        
        if (!bodyData)
            throw new ApiError(404, 'At least one fieled must be provided');
        
    const isOnlyOriginalUrl = originalUrl && !title && !description && !image && !imageFileLocalPath;

    const project = await Url.findById(projectId);

    if (!project) throw new ApiError(404, 'No project found');

    const data: { [key: string]: any } = {};

    if (originalUrl && isValidUrl(originalUrl)) {
        const domain = getDomainOfUrl(originalUrl);
        const domainIcon = `${GOOGLE_FAVICON_URL}${domain}`;

        data.domain = domain;
        data.domainIcon = domainIcon;
        data.originalUrl = originalUrl;
    }

    if (imageFileLocalPath) {
        let publicUrl = await uploadOnCloudinary(imageFileLocalPath);
        if (!publicUrl)
            throw new ApiError(
                500,
                'Somthing wrong with uploading on cloudinary'
            );
        data.image = publicUrl?.url;
    } else if (image) {
        if (isValidUrl(image)) {
            data.image = image;
        } else {
            throw new ApiError(405, 'Image url is not valid', image);
        }
    }

    if (
        project?.image?.startsWith('http://res.cloudinary.com/backendmk') &&
        (imageFileLocalPath || image || isOnlyOriginalUrl)
    ) {
        // need to delete old photo from cloudinary
        try {
            await deleteSingleAsset(project?.image);
        } catch (error) {
            console.error('error in deleting image', error);
        }
    }

    if(isOnlyOriginalUrl){
        // need to clear the title, description and image if exists
        try {
            
            await Url.updateOne({ _id:projectId, title: { $exists:true}}, { $unset: { title: 1, description:1, image: 1} })

        } catch (error) {
            throw new ApiError(500, "Somthing wrong in clearing fileds", error)
        }
    }

    if (title) data.title = title;
    if (description) data.description = description;

    data.isCustomized = !!(title || description || image || imageFileLocalPath);

    try {
        const response = await Url.findByIdAndUpdate(projectId, data, {
            new: true,
        });

        if (!response) throw new ApiError(500, 'not able to update shortUrl');

        return res.status(200).json(new ApiResponse(200, 'URL Updated'));
    } catch (error) {
        throw new ApiError(500, 'Somthing wrong with mongoDb', error);
    }
});

const getTotalClicks = asyncHandler(
    async (req: CustomeRequest, res: Response) => {
        const userId = req?.user?._id;

        if (!userId) throw new ApiError(404, 'failed to get userId');

        const user = await User.findById(userId);

        if (!user) throw new ApiError(404, 'User not found');

        const response = await Url.aggregate([
            {
                $match: { owner: new mongoose.Types.ObjectId(userId) },
            },
            {
                $lookup: {
                    from: 'statics',
                    localField: '_id',
                    foreignField: 'projectId',
                    as: 'statics',
                    pipeline: [
                        {
                            $project: {
                                updatedAt: 1,
                                projectType: 1,
                            },
                        },
                    ],
                },
            },
            {
                $addFields: {
                    clicks: {
                        $size: '$statics',
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalClicks: { $sum: '$clicks' },
                },
            },
            {
                $project: {
                    _id: 0,
                    clicks: '$totalClicks',
                    projectType: 'Url',
                },
            },
        ]);

        if (!response.length) {
            return res
                .status(200)
                .json(new ApiResponse(200, 'zero proejcts', { clicks: 0 }));
        }

        return res.status(200).json(new ApiResponse(200, 'success', response));
    }
);

// https://ipinfo.io/${clientIp}?token=${IPINFO_API_KEY}

export {
    getMetaData,
    getShortLink,
    shortUrl,
    getAllShortUrlOfUser,
    getAllStaticsByProjectId,
    deleteUrl,
    editUrl,
    getTotalClicks,
};
