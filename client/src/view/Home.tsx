import { useUser } from '../features/auth/authSlice';
import { useAppSelector } from '../app/hook';
import { ApexChart, CardContainer } from '../components';
import style from '../styles/home/home.module.scss';
import React from 'react';
import { usePrivateAxios } from '../services/api';
import { CardContainerProps } from '../interface';
import { getAllShortUrl, getTotalClicks } from '../services/urls';
import { Button, Container } from '../ui';
import { useNavigate } from 'react-router-dom';

interface LinkResponse extends CardContainerProps {}
interface ProjectsClicks {
    clicks: number;
    projectType: string;
}

const Home = () => {
    const user = useAppSelector(useUser);
    const privateAxios = usePrivateAxios();
    const navigate = useNavigate();

    const [Projects, setProjects] = React.useState<Array<LinkResponse> | []>(
        []
    );
    const [Clicks, setClicks] = React.useState<Array<ProjectsClicks> | []>([]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [projects, projectClicks] = await Promise.all([
                    getAllShortUrl({ axios: privateAxios, limit: 5 }),
                    getTotalClicks(privateAxios),
                ]);

                if (projects) setProjects(projects?.data?.response);
                if (projectClicks) setClicks(projectClicks?.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className={style['home']}>
            {user && <h1>Welcome {user?.fullName}</h1>}
            <div className={style['performance']}>
                <div className={style['top-project']}>
                    <h6>Top projects</h6>
                    {Projects.length ? (
                        Projects.map((link) => (
                            <CardContainer key={link._id} {...link} />
                        ))
                    ) : (
                        <div>No Data to Show</div>
                    )}
                </div>
                <div className={style['analytics']}>
                    <h6>Analytics</h6>
                    <Container className={style['body']}>
                        {Clicks?.length ? (
                            <ApexChart
                                series={[Clicks[0]?.clicks]}
                                type="radialBar"
                                categories={[
                                    Clicks[0]?.projectType.toUpperCase(),
                                ]}
                                height={380}
                                settings={{
                                    plotOptions: {
                                        radialBar: {
                                            track: {
                                                background:
                                                    'var(--page-default)',
                                            },
                                            dataLabels: {
                                                name: {
                                                    fontSize: '22px',
                                                },
                                                value: {
                                                    fontSize: '16px',
                                                    color: 'var(--text-placeholder)',
                                                },
                                                total: {
                                                    show: true,
                                                    label: 'Total Clicks',
                                                    color: 'var(--text-placeholder)',
                                                    formatter: function (w) {
                                                        return w.globals.seriesTotals.reduce(
                                                            (
                                                                a: number,
                                                                b: number
                                                            ) => {
                                                                return a + b;
                                                            },
                                                            0
                                                        );
                                                    },
                                                },
                                            },
                                        },
                                    },
                                    labels: [
                                        Clicks[0]?.projectType.toUpperCase(),
                                    ],
                                }}
                            />
                        ) : (
                            <div>No Data to show</div>
                        )}
                    </Container>
                </div>
            </div>
            <div className={style['short-links']}>
                <h6>Short Link</h6>
                <div
                    style={{
                        maskImage:
                            'linear-gradient(rgb(0,0,0), rgb(0, 0, 0, .2))',
                    }}
                >
                    {Projects.length ? (
                        Projects.slice(0, 3).map((link) => (
                            <CardContainer key={link._id} {...link} />
                        ))
                    ) : (
                        <div>No Data to Show</div>
                    )}
                </div>
                <p
                    style={{
                        textAlign: 'center',
                        color: 'var(--text-brand)',
                        cursor: 'pointer',
                        fontSize: 'small',
                    }}
                    onClick={() => navigate('/sl')}
                >
                    See All
                </p>
            </div>
        </div>
    );
};

export default Home;
