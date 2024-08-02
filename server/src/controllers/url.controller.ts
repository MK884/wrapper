import { Response } from 'express';
import { CustomeRequest } from '../interface';
import { ApiError, ApiResponse, asyncHandler } from '../utils';
import { GOOGLE_FAVICON_URL } from '../constant';
import parse from 'node-html-parser';
import he from 'he';

const isValidUrl = (url: string): boolean => {
    if (url.includes('localhost')) return false;

    if (!url.startsWith('https')) return false;

    try {
        new URL(url);
        return true;
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

const getMetaData = asyncHandler(async (req: CustomeRequest, res: Response) => {
    const { url } = req?.body;


    if (!url) throw new ApiError(400, 'URl not provided');

    if (!isValidUrl(url)) throw new ApiError(404, 'URL is not valid');

    const response = await fetch(url, {
        headers: { 'User-Agent': 'Wrapper Bot' },
    });

    const htmlContent = await response.text();

    if (!htmlContent) {
        return res
            .status(200)
            .json(
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

    const title =
        titleTag
        MetaData['og:title'] ||
        MetaData['title'] ||
        MetaData['twitter:title'] 

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
            domain
        })
    );
});


// {
//     "statusCode": 200,
//     "message": "Successfully fetched metaData",
//     "data": {
//         "domainIcon": "https://www.google.com/s2/favicons?sz=64&domain_url=hoppscotch.io",
//         "title": "Hoppscotch • Open source API development ecosystem",
//         "description": "Helps you create requests faster, saving precious time on development.",
//         "banner": "https://hoppscotch.io/banner.png",
//         "keywords": "hoppscotch, hopp scotch, hoppscotch online, hoppscotch app, postwoman, postwoman chrome, postwoman online, postwoman for mac, postwoman app, postwoman for windows, postwoman google chrome, postwoman chrome app, get postwoman, postwoman web, postwoman android, postwoman app for chrome, postwoman mobile app, postwoman web app, api, request, testing, tool, rest, websocket, sse, graphql, socketio",
//         "originalUrl": "https://hoppscotch.io/",
//         "siteName": "Hoppscotch"
//     },
//     "success": true
// }

export { getMetaData };
