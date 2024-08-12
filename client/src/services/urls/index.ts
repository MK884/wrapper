import { AxiosError, AxiosInstance } from 'axios';
import publicAxios from '../../services/api';

const getMetaData = async (url: string, axios: AxiosInstance) => {
    if (!url) return 'No url specified';

    try {
        let trimUrl = url.trim();
        const response = await axios.post('/url/meta-data', { url: trimUrl });

        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError && error?.response) {
            let serverError = error?.response?.data;

            console.error('Server error in getMetaData', serverError);

            throw new Error(
                serverError?.message || 'Server error in getMetaData'
            );
        }
        console.error('Error in getMetaData', error);
        throw new Error('Unexpected Error in getMetaData');
    }
};

interface GetShortUrlProps {
    originalUrl?: string;
    title?: string;
    imageFile?: File;
    image?: string;
    description?: string;
}

const getShortUrl = async (
    { originalUrl, title, imageFile, image, description }: GetShortUrlProps,
    axios: AxiosInstance
) => {
    if (!originalUrl) return 'Original url not specified';

    const formData = new FormData();

    try {
        if (title) {
            formData.append('title', title);
            formData.append('originalUrl', originalUrl);
            if (description) formData.append('description', description);
            if (imageFile) {
                formData.append('imageFile', imageFile);
            } else if (image) {
                formData.append('image', image);
            }
        } else {
            formData.append('originalUrl', originalUrl);
        }
        const response = await axios.post('/url/short-url', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError && error?.response) {
            let serverError = error?.response?.data;

            console.error('Server error in getShortUrl', serverError);

            throw new Error(serverError?.message || 'Server error in getShort');
        }
        console.error('Error in getShortUrl', error);
        throw new Error('Unexpected Error in getShortUrl');
    }
};

const editUrl = async (
    { originalUrl, title, imageFile, image, description }: GetShortUrlProps,
    projectId: string,
    axios: AxiosInstance
) => {

    if(!projectId) return ;
    console.log("request");
    

    const formData = new FormData();

    if (title) formData.append('title', title);
    if (description) formData.append('description', description);
    if (imageFile) {
        formData.append('imageFile', imageFile);
    } else if (image) {
        formData.append('image', image);
    }
    if (originalUrl) formData.append('originalUrl', originalUrl);

    try {

        const response = await axios.patch(`/url/e/${projectId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError && error?.response) {
            let serverError = error?.response?.data;

            console.error('Server error in getShortUrl', serverError);

            throw new Error(serverError?.message || 'Server error in getShort');
        }
        console.error('Error in getShortUrl', error);
        throw new Error('Unexpected Error in getShortUrl');
    }
};
const getAllShortUrl = async (
    axios: AxiosInstance,
    search: string | undefined
) => {
    if (!axios) return;

    let searchTerm = search ?? '';

    try {
        const response = await axios.get(`/url/get-all?search=${searchTerm}`);

        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError && error?.response) {
            let serverError = error?.response?.data;
            console.error('Server error in getAllShortUrl', serverError);
            throw new Error(
                serverError?.message || 'Server error in getAllShort'
            );
        }
        console.error('Unexpected error in getAllShortUrl', error);
        throw new Error('Unexpected error in getAllShortUrl');
    }
};

const deleteUrlData = async (projectId: String, axios: AxiosInstance) => {
    if (!projectId || !axios) return;

    try {
        const response = await axios.delete(`/url/${projectId}`);

        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError && error?.response) {
            let serverError = error?.response?.data;

            console.error('Server error in deleteUrlData', serverError);

            throw new Error(serverError?.message || 'Server Error');
        }
        console.error('Unexpected Error in deleteUrlData ', error);
        throw new Error('Unexpected error in deleteUrlData');
    }
};

const getStatsByProjectId = async (projectId: string, axios: AxiosInstance) => {
    if (!projectId) return;

    try {
        const response = await axios.get(`/url/p?projectId=${projectId}`);

        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError && error?.response) {
            let serverError = error.response?.data;

            console.error('Server error in getStatsByProjectId ', serverError);

            throw new Error(serverError?.message || 'Server Error');
        }
        console.error('Unexpected error in getStatsByProjectId', error);
        throw new Error('Unexpected error in getStatsByProjectId');
    }
};

export {
    getMetaData,
    getShortUrl,
    getAllShortUrl,
    deleteUrlData,
    getStatsByProjectId,
    editUrl,
};
