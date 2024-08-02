import { IoLogOutOutline, IoSettingsOutline } from 'react-icons/io5';
import { Avatar, Divider, ToolMenuWrapper, ToolOptions } from '../ui';
import { useAppDispatch, useAppSelector } from '../app/hook';
import { useUser, logout as logoutAction } from '../features/auth/authSlice';
import { logout as apiLogout } from '../services/user';
import { usePrivateAxios } from '../services/api';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import React from 'react';

const ProfileMenu = () => {
    const user = useAppSelector(useUser);
    const dispatch = useAppDispatch();
    const privateAxios = usePrivateAxios();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        console.log('logged out Clicked ');
        try {
            const response = await apiLogout(privateAxios);
            console.log('logout response =>', response);
            if (response?.success) {
                dispatch(logoutAction());
                toast.success('User logged out', {
                    autoClose: 1000,
                    position: 'bottom-right',
                    toastId: 'unautherized',
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const [ isMenuVisible, setIsMenuVisible ] = React.useState<boolean>(false);

    return (
        <div>
            <ToolMenuWrapper 
                isMenuVisible={isMenuVisible} 
                setIsMenuVisible={setIsMenuVisible}
                direction="rtl"
                header={
                    <Avatar
                        src={user?.avatar && user.avatar}
                        string={user?.fullName}
                        size="sm"
                    />
                }
            >
                <ToolOptions
                    label="Settings"
                    Icon={IoSettingsOutline}
                    onClick={() => {
                        navigate('/setting')
                        setIsMenuVisible(false);
                    }}
                    active={location?.pathname === '/setting'}
                />
                <Divider />
                <ToolOptions
                    label="Logout"
                    Icon={IoLogOutOutline}
                    IconStyles={{
                        color: '#D72D39',
                    }}
                    onClick={handleLogout}
                />
            </ToolMenuWrapper>
        </div>
    );
};

export default ProfileMenu;
