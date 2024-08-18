import React from 'react';
import style from '../styles/analytics/card.module.scss';
import { Container } from '../ui';


interface data{
    label:string,
    body?:any
}




const AnalyticsTabsCard = ({data}:{data:data[]}) => {
    const [tabIndex, setTabIndex] = React.useState<number>(0);

    if (!data || data.length === 0) {
        return <div>No tabs available</div>;
    }

    return (
        <Container
            styles={{
                width: '100%',
                padding: 0,
                height: '400px',
                borderRadius: '12px',
                display:'flex',
                flexDirection: 'column',
            }}
        >
            <div className={style['header']}>
                {data && data?.map((item, idx) => (
                    <div
                        className={`${style['tab']} ${tabIndex === idx && style['active']}`}
                        key={idx}
                        onClick={() => setTabIndex(idx)}
                    >
                        {item?.label}
                    </div>
                ))}
            </div>
            <div className={style['body']}>
                {data[tabIndex].body ?? <div className={style['no-data']}>No Data Available</div>}
            </div>
        </Container>
    );
};

export default AnalyticsTabsCard;
