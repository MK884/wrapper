import Container from '../ui/Container';
import style from '../styles/home/home.module.scss';
import { Avatar, Button, Divider, Modal, ToolMenuWrapper, ToolOptions } from '../ui';
import React from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdOutlineContentCopy } from 'react-icons/md';
import { IoAnalytics } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { FaRegEdit } from 'react-icons/fa';
import { IoQrCodeOutline } from 'react-icons/io5';
import { IoMdDoneAll } from 'react-icons/io';

interface CardContainerProps {
    AvatarUrl?: string;
    fullName?: string;
    link: string;
    clicks?: number;
    projectId: string;
}

const CardContainer = ({
    AvatarUrl,
    fullName,
    link,
    clicks = 0,
    projectId,
}: CardContainerProps) => {
    const [isMenuVisible, setIsMenuVisible] = React.useState<boolean>(false);
    const menuRef = React.useRef<HTMLDivElement>(null);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(link);
        setShowCopy(false)
        setTimeout(()=> setShowCopy(true), 1000)
    };

    const autoCloseMenu = (e: Event) => {
        if (menuRef?.current && !menuRef?.current?.contains(e.target as Node)) {
            setIsMenuVisible(false);
        }
    };

    const [ ShowCopy, setShowCopy] = React.useState<boolean>(true)

    React.useEffect(() => {
        
        document.addEventListener('mousedown', autoCloseMenu);

        return () => removeEventListener('mousedown', autoCloseMenu);
    }, []);

    return (
        <>
        <div className={style['main']}>
            <Container className={style['card-container']}>
                <div className={style['card-data']}>
                    <Avatar src={AvatarUrl} string={fullName} />
                    <p>{link}</p>
                </div>
                <div className={style['card-tool']}>
                    <div className={style['click']}>
                        <IoAnalytics />
                        <p>Clicks {clicks}</p>
                    </div>
                    <div className={style['tool']} onClick={copyToClipboard}>
                    {ShowCopy ? <MdOutlineContentCopy /> : <IoMdDoneAll color='green' />}
                    </div>

                    <div
                        className={style['tool']}
                        ref={menuRef}
                        onClick={() =>
                            setIsMenuVisible((prev) => (prev ? false : true))
                        }
                    >
                        <BsThreeDotsVertical />
                    </div>
                </div>
            </Container>
            <div
                className={`${style['tool-options']} ${isMenuVisible && style['active']}`}
            >
                <ToolOptions label="Edit" Icon={FaRegEdit} />
                <ToolOptions label="QR Code" Icon={IoQrCodeOutline} />
                <Divider />
                <ToolOptions
                    label="Delete"
                    Icon={FaRegTrashAlt}
                    styles={{
                        background: '#D72D39',
                    }}
                />
            </div>
        </div>
        <Modal isModalOpen={false} modalContent={<p>Delete</p>}/>
        </>
    );
};

const Home = () => {
    return (
        <div className={style['home']}>
            <h1>Welcome Khalid Merchant</h1>
            <div className={style['performance']}>
                <div className={style['top-project']}>
                    <h6>Top projects</h6>
                    <CardContainer link="Short Link" projectId="" clicks={10} />
                    <CardContainer link="Short Link" projectId="" clicks={10} />
                    <CardContainer link="Short Link" projectId="" clicks={10} />
                    <CardContainer link="Short Link" projectId="" clicks={10} />
                    <CardContainer link="Short Link" projectId="" clicks={10} />
                </div>
                <div>
                    <h4>Analytics</h4>
                </div>
            </div>
        </div>
    );
};

export default Home;
