import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { usePrivateAxios } from '../services/api';
import { getStatsByProjectId } from '../services/urls';
import style from '../styles/analytics/analytics.module.scss';
import Container from '../ui/Container';
import { Avatar } from '../ui';
import { MdOutlineContentCopy } from 'react-icons/md';
import { MdOutlineSubdirectoryArrowRight } from "react-icons/md";
import { IoMdDoneAll } from 'react-icons/io';
import config from '../config';
import { AnalyticsTabsCard } from '../components';

interface Stats {
    _id: string;
    projectId: string;
    projectType: string;
    city?: string;
    country?: string;
    region?: string;
    device?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface linkInfo {
    shortUrl: string;
    originalUrl: string;
    domainIcon: string;
    domain: string;
    totalClicks: number;
}



const device = [
    {
        label:'Devices',
        body:<div>Devices</div>

    }
];
const locations = [
    {
        label:'Country',
        body:<div>Country</div>
    },
    {
        label:'City',
        body:<div>City</div>
    },
    {
        label:'Region'
    }
]

const Analytics = () => {
    const { projectId } = useParams();

    const privateAxios = usePrivateAxios();

    const location = useLocation();

    if (location?.state) console.log(location.state);

    const [statas, setStats] = React.useState<Stats[] | []>([]);
    const [linkInfo, setLinkInfo] = React.useState<linkInfo>();
    const [ShowCopy, setShowCopy] = React.useState<boolean>(true);

    const devices: { [key: string]: number } = {};
    const countrys: { [key: string]: number } = {};
    const citys: { [key: string]: number } = {};
    const regions: { [key: string]: number } = {};

    statas.length &&
        statas.forEach((item) => {
            let device = item?.device;

            if (device) {
                if (devices[device]) {
                    devices[device] += 1;
                } else {
                    devices[device] = 1;
                }
            }

            let city = item?.city;

            if (city) {
                if (citys[city]) {
                    citys[city] += 1;
                } else {
                    citys[city] = 1;
                }
            }

            let country = item?.country;

            if (country) {
                if (countrys[country]) {
                    countrys[country] += 1;
                } else {
                    countrys[country] = 1;
                }
            }

            let region = item?.region;

            if (region) {
                if (regions[region]) {
                    regions[region] += 1;
                } else {
                    regions[region] = 1;
                }
            }
        });

    console.log('Devices => ', devices);
    console.log('Countrys => ', countrys);
    console.log('Citys => ', citys);
    console.log('Regions => ', regions);

    React.useEffect(() => {
        const getStats = async () => {
            if (!projectId) return;

            try {
                const stats = await getStatsByProjectId(
                    projectId,
                    privateAxios
                );

                const linkInfo: linkInfo = {
                    domain: stats.data.domain,
                    domainIcon: stats.data.domainIcon,
                    originalUrl: stats.data.originalUrl,
                    shortUrl: stats.data.shortUrl,
                    totalClicks: stats.data.clicks ?? 0,
                };

                setLinkInfo(linkInfo);
                setStats(stats.data.statics);
            } catch (error) {
                console.error(error);
            }
        };

        getStats();
    }, []);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(`${config.appURL}/${linkInfo?.shortUrl}`);
        setShowCopy(false);
        setTimeout(() => setShowCopy(true), 1000);
    };

    return (
        <>
            <div className={style['main']}>
                <div className={style['wrapper']}>
                    <div className={style['head']}>
                        <h4>Analytics</h4>
                    </div>
                    <div className={style['body']}>
                        <Container className={style['info']}>
                            <div>
                                <Avatar src={linkInfo?.domainIcon} styles={{
                                    background:'transparent',
                                    border:'none'
                                }}/>
                                <div className={style['details']}>
                                    <Link
                                        to={`${config.appURL}/${linkInfo?.shortUrl}`}
                                        target="_"
                                        className={style['short-link']}
                                        style={{
                                            maxWidth:'fit-content'
                                        }}
                                    >
                                        <p>{`${config.appURL}/${linkInfo?.shortUrl}`}</p>
                                    </Link>
                                   <div>
                                    <MdOutlineSubdirectoryArrowRight />
                                   <Link
                                        to={`${linkInfo?.originalUrl}`}
                                        target="_"
                                        className={style['original-link']}
                                    >
                                        <p>{`${linkInfo?.originalUrl}`}</p>
                                    </Link>
                                   </div>
                                </div>
                            </div>
                            <div
                                className={style['tool']}
                                onClick={copyToClipboard}
                            >
                                {ShowCopy ? (
                                    <MdOutlineContentCopy />
                                ) : (
                                    <IoMdDoneAll color="green" />
                                )}
                            </div>
                        </Container>
                        <Container>Total Clicks : {linkInfo?.totalClicks}</Container>
                        <div className={style['link-data']}>
                           <AnalyticsTabsCard data={device}/>
                           <AnalyticsTabsCard data={locations}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Analytics;
