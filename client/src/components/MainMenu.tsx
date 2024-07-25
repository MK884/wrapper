import { IoMdHelpCircleOutline } from 'react-icons/io';
import { MdOutlineRoundaboutRight } from 'react-icons/md';
import { RiFindReplaceLine } from 'react-icons/ri';
import { FaLink } from 'react-icons/fa6';
import { MdOutlineDashboardCustomize } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { Divider, ToolMenuWrapper, ToolOptions } from 'ui';
import ThemeSwitch from './ThemeSwitch';

const MainMenuData = [
    {
        label: 'Dashboard',
        icon: MdOutlineDashboardCustomize,
        path: '/home',
    },
    {
        label: 'Create New',
        icon: FaLink,
        path: '/create-new',
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
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    return (
        <div>
            <ToolMenuWrapper>
                <ToolOptions label="Search" Icon={RiFindReplaceLine} />
                {MainMenuData.map((item, idx) => (
                    <ToolOptions
                        label={item?.label}
                        onClick={() => {
                            setSelectedIndex(idx);
                            navigate(item?.path);
                        }}
                        Icon={item?.icon}
                        key={idx}
                        active={idx === selectedIndex}
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
