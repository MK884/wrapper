import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { usePrivateAxios } from '../services/api';
import { getStatsByProjectId } from '../services/urls';
import style from '../styles/analytics/analytics.module.scss';
import Container from '../ui/Container';
import { Avatar, BarChart } from '../ui';
import { MdOutlineContentCopy } from 'react-icons/md';
import { MdOutlineSubdirectoryArrowRight } from 'react-icons/md';
import { IoMdDoneAll } from 'react-icons/io';
import config from '../config';
import { AnalyticsTabsCard, ApexChart } from '../components';

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

const Analytics = () => {
    const { projectId } = useParams();

    const privateAxios = usePrivateAxios();

    const [linkInfo, setLinkInfo] = React.useState<linkInfo>();
    const [timeStamp, setTimeStamp] = React.useState<Array<string> | null>(
        null
    );
    const [sourceDevice, setSourceDevice] = React.useState<{
        [key: string]: number;
    } | null>(null);
    const [sourceCountry, setSourceCountry] = React.useState<{
        [key: string]: number;
    } | null>(null);
    const [sourceCity, setSourceCity] = React.useState<{
        [key: string]: number;
    } | null>(null);
    const [sourceRegion, setSourceRegion] = React.useState<{
        [key: string]: number;
    } | null>(null);
    const [clicks, setClicks] = React.useState<Array<number> | null>(null);
    const [ShowCopy, setShowCopy] = React.useState<boolean>(true);

    const prepareStats = (stats: Stats[]) => {
        if (!stats?.length) return;

        const devices: { [key: string]: number } = {};
        const countrys: { [key: string]: number } = {};
        const citys: { [key: string]: number } = {};
        const regions: { [key: string]: number } = {};
        const timeClicks: { [key: string]: number } = {};

        stats.forEach((item) => {
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

            let createdAt = item?.createdAt;

            if (createdAt) {
                let localTime = new Date(createdAt).toLocaleString('GB-en', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                });

                if (timeClicks[localTime]) {
                    timeClicks[localTime] += 1;
                } else {
                    timeClicks[localTime] = 1;
                }
            }
        });
        if (Object.keys(timeClicks).length) {
            setTimeStamp(Object.keys(timeClicks));
            setClicks(Object.values(timeClicks));
        }

        if (Object.keys(devices).length) {
            setSourceDevice(devices);
        }
        if (Object.keys(countrys).length) {
            setSourceCountry(countrys);
        }
        if (Object.keys(citys).length) {
            setSourceCity(citys);
        }
        if (Object.keys(regions).length) {
            setSourceRegion(regions);
        }
    };

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
                prepareStats(stats.data.statics);
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

    const device = [
        {
            label: 'Devices',
            body: sourceDevice && <BarChart data={sourceDevice} />,
        },
    ];

    const locations = [
        {
            label: 'Country',
            body: sourceCountry && <BarChart data={sourceCountry} isLocation />,
        },
        {
            label: 'City',
            body: sourceCity && <BarChart data={sourceCity} isLocation />,
        },
        {
            label: 'Region',
            body: sourceRegion && <BarChart data={sourceRegion} isLocation />,
        },
    ];

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
                                <Avatar
                                    src={linkInfo?.domainIcon}
                                    styles={{
                                        background: 'transparent',
                                        border: 'none',
                                    }}
                                />
                                <div className={style['details']}>
                                    <Link
                                        to={`${config.appURL}/${linkInfo?.shortUrl}`}
                                        target="_"
                                        className={style['short-link']}
                                        style={{
                                            maxWidth: 'fit-content',
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
                        <Container className={style['clicks']}>
                            <span
                                style={{
                                    padding: '1rem',
                                }}
                            >
                                Total Clicks : {linkInfo?.totalClicks}
                            </span>
                            {timeStamp?.length && clicks?.length ? (
                                <ApexChart
                                    categories={timeStamp}
                                    series={[
                                        {
                                            name: 'Clicks',
                                            data: clicks,
                                        },
                                    ]}
                                    type="area"
                                />
                            ) : (
                                <div
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        alignContent: 'center',
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                        color: 'var(--text-placeholder)',
                                        fontSize: 'small',
                                    }}
                                >
                                    No Data To show
                                </div>
                            )}
                        </Container>
                        <div className={style['link-data']}>
                            <AnalyticsTabsCard data={device} />
                            <AnalyticsTabsCard data={locations} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Analytics;
