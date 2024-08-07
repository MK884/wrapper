import React from 'react';
import style from '../styles/shortLink/shortLink.module.scss';
import { CardContainer } from './Home';
import { Button, TextInput } from '../ui';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { usePrivateAxios } from '../services/api';
import { getAllShortUrl } from '../services/urls';

const ShortLink = () => {
    const navigate = useNavigate();
    const privateAxios = usePrivateAxios();

    // React.useEffect(() => {
    //     const getAllUrls = async () => {
    //         try {
    //             const response = await getAllShortUrl(privateAxios);
    //             console.log(response?.data);
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     };

    //     getAllUrls();

        
    // }, []);

    return (
        <div className={style['wrapper']}>
            <div className={style['header']}>
                <h4>Short Links</h4>
                <div>
                    <TextInput
                        placeholder="Search..."
                        styles={{
                            minWidth: '20rem',
                            padding: '10px'
                        }}
                       
                    />
                    <Button
                        label="Create New"
                        Icon={FaPlus}
                        onclick={() => navigate('/create-sl')}
                        styles={{
                            minWidth:'9rem'
                        }}
                    />
                </div>
            </div>
            <div className={style['body']}>
                <CardContainer
                    link="ikslaksa"
                    projectId=""
                    clicks={5}
                    lastUpdated="Dec 25 2023"
                />
                <CardContainer
                    link="salslas"
                    projectId=""
                    clicks={5}
                    lastUpdated="Dec 25 2023"
                />
                <CardContainer
                    link="sasa"
                    projectId=""
                    clicks={5}
                    lastUpdated="Dec 25 2023"
                />
                <CardContainer
                    link="sasas"
                    projectId=""
                    clicks={5}
                    lastUpdated="Dec 25 2023"
                />
            </div>
        </div>
    );
};

export default ShortLink;

// "data": [
//         {
//             "_id": "66b08a3cf4a820f17b0fcf1b",
//             "originalUrl": "https://hoppscotch.io/",
//             "shortUrl": "rnxkc23e",
//             "owner": "66a515b6b61d252056fcc23e",
//             "title": "khalid test",
//             "description": "some test description",
//             "image": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//             "domainIcon": "https://www.google.com/s2/favicons?sz=64&domain_url=hoppscotch.io",
//             "isCustomized": true,
//             "domain": "hoppscotch.io",
//             "createdAt": "2024-08-05T08:15:56.068Z",
//             "updatedAt": "2024-08-05T08:15:56.068Z",
//             "__v": 0
//         }
//     ],
