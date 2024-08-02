import { AxiosError, AxiosInstance } from 'axios';

const getMetaData = async (url: string, axios: AxiosInstance) => {
    if (!url) return 'No url specified';

    try {
        let trimUrl = url.trim();
        const response = await axios.post('/url/meta-data', { url: trimUrl});

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

export { getMetaData };
