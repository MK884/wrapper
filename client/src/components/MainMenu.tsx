import { IoMdHelpCircleOutline } from 'react-icons/io';
import { MdOutlineRoundaboutRight } from 'react-icons/md';
import { RiFindReplaceLine } from 'react-icons/ri';
import { FaLink } from 'react-icons/fa6';
import { MdOutlineDashboardCustomize } from 'react-icons/md';
import { useLocation, useNavigate} from 'react-router-dom';
import { Divider, ToolMenuWrapper, ToolOptions } from '../ui';
import ThemeSwitch from './ThemeSwitch';
import { VscGitPullRequestCreate } from "react-icons/vsc";
import React from 'react';


const MainMenuData = [
    {
        label: 'Home',
        icon: MdOutlineDashboardCustomize,
        path: '/',
    },
    {
        label: 'Create New',
        icon: VscGitPullRequestCreate,
        path: '/create-new',
    },
    {
        label: 'Short Link',
        icon: VscGitPullRequestCreate,
        path: '/sl',
    },
    {
        label: 'Help',
        icon: IoMdHelpCircleOutline,
        path: '/help',
    },
    {
        label: 'About',
        icon: MdOutlineRoundaboutRight,
        path: '/about',
    },
];

const MainMenu = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [ isMenuVisible, setIsMenuVisible ] = React.useState<boolean>(false);



    return (
        <div>
            <ToolMenuWrapper isMenuVisible={isMenuVisible} setIsMenuVisible={setIsMenuVisible}>
                <ToolOptions label="Search" Icon={RiFindReplaceLine} />
                {MainMenuData.map((item, idx) => (
                    <ToolOptions
                        label={item?.label}
                        onClick={() => {
                            navigate(item?.path);
                            setIsMenuVisible(false)
                        }}
                        Icon={item?.icon}
                        key={idx}
                        active={location.pathname === item?.path}
                    />
                ))}
                <Divider />
                <ToolOptions
                    label="Theme"
                    indicator={<ThemeSwitch />}
                    hoverEffect={false}
                    styles={{
                        cursor: 'default',
                    }}
                />
            </ToolMenuWrapper>
        </div>
    );
};

export default MainMenu;
