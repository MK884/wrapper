import React from 'react';
import { useParams } from 'react-router-dom';
import { Loader } from '../ui';
import config from '../config';

const Redirect = () => {
    const { shortUrl } = useParams();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [isError, setIsError] = React.useState<boolean>(false);

    React.useEffect(() => {
        window.location.href = `${config.baseURL}/api/v1/url/?shortUrl=${shortUrl}`;
    }, []);

    // React.useEffect(() => {
    //     (async () => {
    //         setIsLoading(true);
    //         if (!params?.shortUrl) return;
    //         try {
    //             await redirectTo(params?.shortUrl);
    //         } catch (error) {
    //             console.error(error);
    //             setIsError(true)
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     })();
    // }, []);

    if (isError)
        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100dvh',
                }}
            >
                {' '}
                Page Not found...
            </div>
        );

    if (isLoading)
        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100dvh',
                }}
            >
                <Loader />
            </div>
        );
};

export default Redirect;
