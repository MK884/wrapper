import React from 'react';
import style from '../styles/analytics/card.module.scss';
import { Container } from '../ui';


interface data{
    label:string,
    body?:any
}




const AnalyticsTabsCard = ({data}:{data:data[]}) => {
    const [tabIndex, setTabIndex] = React.useState<number>(0);

    return (
        <Container
            styles={{
                width: '100%',
                padding: 0,
                minHeight: '400px',
                borderRadius: '12px',
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
