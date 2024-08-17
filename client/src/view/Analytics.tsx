import Chart from 'react-apexcharts';
import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { usePrivateAxios } from '../services/api';
import { getStatsByProjectId } from '../services/urls';
import style from '../styles/analytics/analytics.module.scss';
import Container from '../ui/Container';
import { Avatar } from '../ui';
import { MdOutlineContentCopy } from 'react-icons/md';
import { MdOutlineSubdirectoryArrowRight } from 'react-icons/md';
import { IoMdDoneAll } from 'react-icons/io';
import config from '../config';
import { AnalyticsTabsCard } from '../components';
import { ApexOptions } from 'apexcharts';

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

const colors = [
    '#008FFB',
    '#00E396',
    '#FEB019',
    '#FF4560',
    '#775DD0',
    '#00D9E9',
    '#FF66C3',
];

const CountryGraph = () => {
    const series = [
        {
            name: 'Clicks',
            data: [400],
        },
    ];
    const options = {
        chart: {
            type: 'bar',
            height: 350,
            stacked: true,
            stackedType: '100%',
        },
        plotOptions: {
            bar: {
                borderRadius: 12,
                horizontal: true,
                barHeight: '60px',
                dataLabels: {
                    position: 'bottom',
                },
            },
        },
        grid: {
            show: false,
        },
        dataLabels: {
            enabled: true,
            textAnchor: true,
            formatter: function (val: any, opt: any) {
                return opt.w.globals.labels[opt.dataPointIndex];
            },
        },
        xaxis: {
            show: false,
            categories: ['India'],
            axisBorder: false,
            labels: {
                show: false,
            },
        },
        yaxis: {
            labels: {
                show: false,
            },
        },
    };

    return (
        <>
            <Chart options={options} type="bar" series={series} height={300} />
        </>
    );
};

const ClicksGraph = ({
    seriesData,
    categories,
}: {
    seriesData: Array<number>;
    categories: Array<string>;
}) => {
    if (!seriesData?.length && !categories?.length) return;

    const series = [
        {
            name: 'Clicks',
            data: seriesData,
        },
    ];

    const options: ApexOptions = {
        grid: {
            show: false,
        },
        chart: {
            height: 350,
            type: 'area',
            toolbar: {
                show: true,

                tools: {
                    download: true,
                    selection: false,
                    zoom: false,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                    reset: false,
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'smooth',
        },
        xaxis: {
            type: 'datetime',

            categories: categories,
            labels: {
                style: {
                    colors: 'var(--text-placeholder)',
                },
            },
        },
        yaxis: {
            stepSize: 1,
            forceNiceScale: true,
            labels: {
                style: {
                    colors: 'var(--text-placeholder)',
                },
            },
        },
        tooltip: {
            x: {
                format: 'dd/MM/yy HH:mm',
            },
        },
    };

    return (
        <>
            <Chart options={options} series={series} type="area" height={300} />
        </>
    );
};

const DeviceGraph = () => {
    const series = [
        {
            name: 'Clicks',
            data: [5, 8],
        },
    ];
    const options = {
        chart: {
            type: 'bar',
            height: 350,
            stacked: true,
            stackedType: '100%',
        },
        plotOptions: {
            bar: {
                borderRadius: 12,
                horizontal: true,
                barHeight: '60px',
                dataLabels: {
                    position: 'bottom',
                },
            },
        },
        grid: {
            show: false,
        },
        dataLabels: {
            enabled: true,
            textAnchor: true,
            formatter: function (val: any, opt: any) {
                return opt.w.globals.labels[opt.dataPointIndex];
            },
        },
        xaxis: {
            show: false,
            categories: ['Desktop', 'Mobile'],

            axisBorder: false,
            labels: {
                show: false,
            },
        },
        yaxis: {
            labels: {
                show: false,
            },
        },
    };

    return (
        <>
            <Chart options={options} type="bar" series={series} height={300} />
        </>
    );
};

const device = [
    {
        label: 'Devices',
        body: <DeviceGraph />,
    },
];
const locations = [
    {
        label: 'Country',
        body: <CountryGraph />,
    },
    {
        label: 'City',
        body: <div>City</div>,
    },
    {
        label: 'Region',
    },
];

const Analytics = () => {
    const { projectId } = useParams();

    const privateAxios = usePrivateAxios();

    const location = useLocation();

    if (location?.state) console.log(location.state);

    const [linkInfo, setLinkInfo] = React.useState<linkInfo>();
    const [timeStamp, setTimeStamp] = React.useState<Array<string> | null>(
        null
    );
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
                if (timeClicks[createdAt]) {
                    timeClicks[createdAt] += 1;
                } else {
                    timeClicks[createdAt] = 1;
                }
            }
        });
        if (Object.keys(timeClicks).length) {
            setTimeStamp(Object.keys(timeClicks));
            setClicks(Object.values(timeClicks));
        }
    };

    timeStamp && console.log('Time => ', timeStamp);
    clicks && console.log('clicks => ', clicks);

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
                        <Container>
                            Total Clicks : {linkInfo?.totalClicks}
                            {timeStamp?.length && clicks?.length ? (
                                <ClicksGraph
                                    categories={timeStamp}
                                    seriesData={clicks}
                                />
                            ) : (
                                <>No Data To show</>
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
