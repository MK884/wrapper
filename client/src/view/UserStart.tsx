import React from 'react';
import style from '../styles/getStart/start.module.scss';
import Login from '../components/Login';
import Register from '../components/Register';

type tabOptions = 'register' | 'login';

const UserStart = () => {
    const [tab, setTab] = React.useState<tabOptions>('login');

    const changeTab = (e: React.MouseEvent<HTMLDivElement>) => {
        const currentTab = e.currentTarget?.getAttribute(
            'data-tab'
        ) as tabOptions;
        if (currentTab) setTab(currentTab);
    };

    return (
        <div className={`${style[`wrapper`]}`}>
            <h1>Wrapper</h1>
            <div className={`${style['container']}`}>
                <div className={`${style['header']}`}>
                    <div
                        className={`${style['tab']} ${tab === 'register' && style['tab-active']}`}
                        onClick={changeTab}
                        data-tab="register"
                    >
                        Register
                    </div>
                    <div
                        className={`${style['tab']} ${tab === 'login' && style['tab-active']}`}
                        onClick={changeTab}
                        data-tab="login"
                    >
                        Login
                    </div>
                </div>
                <div className={`${style['body']}`}>
                    {tab === 'login' ? <Login /> : <Register />}
                </div>
            </div>
        </div>
    );
};

export default UserStart;
