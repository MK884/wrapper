import React from 'react';
import { useParams } from 'react-router-dom';
import config from '../config';

const Redirect = () => {
    const { shortUrl } = useParams();

    React.useEffect(() => {
        console.log("Called redirect");
        
        window.location.href = `${config.baseURL}/api/v1/url/?shortUrl=${shortUrl}`;
    }, []);


    return <div>Loading ..... </div>
};

export default Redirect;
