import { useUser } from '../features/auth/authSlice';
import { useAppSelector } from '../app/hook';
import { CardContainer } from '../components';
import style from '../styles/home/home.module.scss';

const Home = () => {

    const user = useAppSelector(useUser)

    return (
        <div className={style['home']}>
            {user && <h1>Welcome {user?.fullName}</h1>}
            <div className={style['performance']}>
                <div className={style['top-project']}>
                    <h6>Top projects</h6>
                    <CardContainer
                        shortUrl="Short Link"
                        updatedAt="Dec 25 2023"
                        _id=""
                        domainIcon=''
                        isCustomized={false}
                        clicks={10}
                    />
                    <CardContainer
                        shortUrl="Short Link"
                        updatedAt="Dec 25 2023"
                        _id=""
                        domainIcon=''
                        isCustomized={false}
                        clicks={10}
                    />
                    <CardContainer
                        shortUrl="Short Link"
                        updatedAt="Dec 25 2023"
                        _id=""
                        domainIcon=''
                        isCustomized={false}
                        clicks={10}
                    />
                    <CardContainer
                        shortUrl="Short Link"
                        updatedAt="Dec 25 2023"
                        _id=""
                        domainIcon=''
                        isCustomized={false}
                        clicks={10}
                    />
                    <CardContainer
                        shortUrl="Short Link"
                        updatedAt="Dec 25 2023"
                        _id=""
                        domainIcon=''
                        isCustomized={false}
                        clicks={10}
                    />
                    
                </div>
                <div>
                    <h6>Analytics</h6>
                </div>
            </div>
        </div>
    );
};

export default Home;
