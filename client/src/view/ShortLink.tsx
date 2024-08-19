import React from 'react';
import style from '../styles/shortLink/shortLink.module.scss';
import { CardContainer } from '../components';
import { Button, Loader, TextInput } from '../ui';
import { FaPlus } from 'react-icons/fa';
import { IoMdRefresh } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { usePrivateAxios } from '../services/api';
import { getAllShortUrl } from '../services/urls';
import { CardContainerProps } from '../interface';

interface LinkResponse extends CardContainerProps {}

const ShortLink = () => {
    const navigate = useNavigate();
    const privateAxios = usePrivateAxios();

    const [allLinks, setAllLinks] = React.useState<LinkResponse[] | []>([]);
    const [search, setSearch] = React.useState<string>();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [refresh, forceRefresh] = React.useState(false);

    React.useEffect(() => {
        const getAllUrls = async () => {
            setIsLoading(true);
            try {
                const response = await getAllShortUrl({axios:privateAxios, search});
                setAllLinks(response?.data?.response);

                console.log(response?.data?.response);
                console.log(response?.data?.total);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        setTimeout(() => {
            getAllUrls();
        }, 1500);
    }, [search, refresh]);

    return (
        <div className={style['wrapper']}>
            <div className={style['header']}>
                <h4>Short Links</h4>
                <div>
                    <TextInput
                        placeholder="Search..."
                        styles={{
                            minWidth: '20rem',
                            padding: '10px',
                        }}
                        value={search}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setSearch(e.target.value)
                        }
                    />
                    <Button
                        label="Create New"
                        Icon={FaPlus}
                        onclick={() => navigate('/create-sl')}
                        styles={{
                            minWidth: '9rem',
                        }}
                    />
                    <Button
                        Icon={IoMdRefresh}
                        onclick={() => forceRefresh((prev) => !prev)}
                        styles={{
                            padding: '10px',
                        }}
                    />
                </div>
            </div>
            {isLoading ? (
                <div
                    style={{
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignContent: 'center',
                    }}
                >
                    <Loader />
                </div>
            ) : allLinks.length ? (
                <div className={style['body']}>
                    {allLinks.map((link) => (
                        <CardContainer key={link._id} {...link} />
                    ))}
                </div>
            ) : (
                <div>No Data to Show</div>
            )}
        </div>
    );
};

export default ShortLink;
