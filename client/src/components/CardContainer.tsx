import { Avatar, Button, Divider, Loader, Modal, ToolOptions } from '../ui';
import React from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdOutlineContentCopy } from 'react-icons/md';
import { IoAnalytics, IoClose } from 'react-icons/io5';
import { FaRegEdit } from 'react-icons/fa';
import { IoQrCodeOutline } from 'react-icons/io5';
import { IoMdDoneAll } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { usePrivateAxios } from '../services/api';
import { deleteUrlData } from '../services/urls';
import { toast } from 'react-toastify';
import { MdOutlineFileDownload } from 'react-icons/md';
import { LuClipboardCopy } from 'react-icons/lu';
import { generateQrCod } from '../utils';
import Container from '../ui/Container';
import style from '../styles/cardContainer/cardContainer.module.scss';
import { CardContainerProps } from 'interface';
import config from '../config';

interface QrModalProps {
    closeModal: Function;
    shortUrl: string;
    avatarUrl?: string;
}

const QrModal = ({ closeModal, shortUrl, avatarUrl }: QrModalProps) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const anchorRef = React.useRef<HTMLAnchorElement>(null);

    const [qrCode, setQrCode] = React.useState<string | null>(null);

    const [copyImg, setCopytImg] = React.useState<boolean>(false);
    const [copyUrl, setCopyUrl] = React.useState<boolean>(false);
    const [downloadImg, setDownloadImg] = React.useState<boolean>(false);

    const autoCloseModal = (e: Event) => {
        if (ref?.current && !ref?.current?.contains(e.target as Node)) {
            closeModal();
        }
    };

    React.useEffect(() => {
        document.addEventListener('mousedown', autoCloseModal);

        const getQr = async () => {
            const responseQr = await generateQrCod(shortUrl);

            if (responseQr) setQrCode(responseQr);

            return;
        };

        getQr();

        return () => document.removeEventListener('mousedown', autoCloseModal);
    }, []);

    const copyShortUrl = () => {
        setCopyUrl(true)
        setTimeout(()=>setCopyUrl(false),1000);
        shortUrl && navigator.clipboard.writeText(shortUrl);
    };

    const copyImage = async () => {
        if (!qrCode) return;
        setCopytImg(true)
        try {
            const response = await fetch(qrCode);

            const blob = await response.blob();

            const image = new ClipboardItem({ 'image/png': blob });

            navigator.clipboard.write([image]);
        } catch (error) {
            console.error('Error in copyImage', error);
        }
        setTimeout(()=>setCopytImg(false), 1000)
    };

    const downloadImage = () => {
        if (!anchorRef?.current) return;
        if (!qrCode) return;

        setDownloadImg(true);
        setTimeout(()=>setDownloadImg(false),1000)

        anchorRef.current.href = qrCode;
        anchorRef.current.download = `${shortUrl}-qrcode.png`;
        anchorRef.current.click();
    };

    return (
        <>
            <div className={style['qr-wrapper']} ref={ref}>
                <div className={style['header']}>
                    <Avatar
                        src={avatarUrl}
                        styles={{
                            background: 'transparent',
                        }}
                    />
                    <h4>QR Code</h4>
                </div>
                <div className={style['body']}>
                    <div className={style['qr-box']}>
                        {qrCode ? (
                            <img alt="QrCode" src={qrCode} />
                        ) : (
                            <Loader />
                        )}
                    </div>
                </div>
                <div className={style['footer']}>
                    <Button
                        label="Copy Url"
                        Icon={copyUrl ? IoMdDoneAll  :MdOutlineContentCopy}
                        onclick={copyShortUrl}
                    />
                    <Button
                        label="Copy Image"
                        Icon={copyImg ? IoMdDoneAll  : LuClipboardCopy}
                        onclick={copyImage}
                    />
                    <Button
                        label="Download"
                        Icon={downloadImg ? IoMdDoneAll  : MdOutlineFileDownload}
                        onclick={downloadImage}
                    />
                </div>
                <a ref={anchorRef} style={{ display: 'none' }} />
            </div>
        </>
    );
};

const DeleteModal = ({
    closeModal,
    projectId,
}: {
    closeModal: Function;
    projectId: String;
}) => {
    const privateAxios = usePrivateAxios();

    const deleteProject = async () => {
        try {
            const response = await deleteUrlData(projectId, privateAxios);
            if (response) {
                toast.success(
                    <p>
                        Url deleted successfully <strong>Refresh</strong>
                    </p>,
                    { autoClose: 3000 }
                );
            }
        } catch (error) {
            console.error(error);
        } finally {
            closeModal();
        }
    };

    return (
        <>
            <div className={style['delete-wrapper']}>
                <div className={style['header']}>
                    Delete Link
                    <IoClose cursor="pointer" onClick={() => closeModal()} />
                </div>
                <div className={style['content']}>
                    <p>This will permanantly delete link and it's data</p>
                </div>
                <div className={style['actions']}>
                    <Button label="Cancel" onclick={() => closeModal()} />
                    <Button
                        label="Delete"
                        variant="danger"
                        onclick={deleteProject}
                    />
                </div>
            </div>
        </>
    );
};

export const CardContainer = (props: CardContainerProps) => {
    const {
        _id,
        clicks = 0,
        domainIcon,
        isCustomized,
        shortUrl,
        description,
        domain,
        image,
        originalUrl,
        title,
        updatedAt,
    } = props;

    const navigate = useNavigate();

    let link = `${config.appURL}/${shortUrl}`;
    let lastUpdated =
        updatedAt &&
        new Date(updatedAt).toLocaleString('en-GB', {
            year: '2-digit',
            month: 'short',
            day: 'numeric',
        });

    const [isMenuVisible, setIsMenuVisible] = React.useState<boolean>(false);
    const menuRef = React.useRef<HTMLDivElement>(null);
    const headRef = React.useRef<HTMLDivElement>(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] =
        React.useState<boolean>(false);
    const [isQrModalOpen, setIsQrModalOpen] = React.useState<boolean>(false);

    const closeDeleteModal = () => setIsDeleteModalOpen(false);
    const closeQrModal = () => setIsQrModalOpen(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(link);
        setShowCopy(false);
        setTimeout(() => setShowCopy(true), 1000);
    };

    const autoCloseMenu = (e: Event) => {
        if (
            menuRef?.current &&
            headRef?.current &&
            !menuRef?.current?.contains(e.target as Node) &&
            !headRef?.current?.contains(e.target as Node)
        ) {
            setIsMenuVisible(false);
        }
    };

    const [ShowCopy, setShowCopy] = React.useState<boolean>(true);

    React.useEffect(() => {
        document.addEventListener('mousedown', autoCloseMenu);

        return () => removeEventListener('mousedown', autoCloseMenu);
    }, []);

    return (
        <>
            <div className={style['main']}>
                <Container className={style['card-container']}>
                    <div className={style['card-data']}>
                        <div className={style['avatar']}>
                            {' '}
                            <Avatar
                                src={domainIcon}
                                string={domain}
                                styles={{
                                    border: 'none',
                                    background: 'transparent',
                                    height: '30px',
                                    width: '30px',
                                }}
                            />
                        </div>
                        <div className={style['link-info']}>
                            <Link
                                to={`${link}`}
                                target="_"
                                className={style['link']}
                            >
                                <p>{link}</p>
                            </Link>
                            {lastUpdated && (
                                <p className={style['last-update']}>
                                    {lastUpdated}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className={style['card-tool']}>
                        <div className={style['click']}>
                            <IoAnalytics />
                            <p>Clicks {clicks}</p>
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

                        <div
                            className={style['tool']}
                            ref={headRef}
                            onClick={() =>
                                setIsMenuVisible((prev) =>
                                    prev ? false : true
                                )
                            }
                        >
                            <BsThreeDotsVertical />
                        </div>
                    </div>
                </Container>
                <div
                    ref={menuRef}
                    className={`${style['tool-options']} ${isMenuVisible && style['active']}`}
                >
                    <ToolOptions
                        label="Edit"
                        Icon={FaRegEdit}
                        onClick={() =>
                            navigate(`/create-sl`, { state: { ...props } })
                        }
                    />
                    <ToolOptions
                        label="QR Code"
                        Icon={IoQrCodeOutline}
                        onClick={() => setIsQrModalOpen(true)}
                    />
                    <Divider />
                    <ToolOptions
                        label="Delete"
                        Icon={FaRegTrashAlt}
                        styles={{
                            background: '#D72D39',
                        }}
                        onClick={() => setIsDeleteModalOpen(true)}
                    />
                </div>
            </div>
            <Modal
                modalContent={
                    <QrModal
                        avatarUrl={domainIcon}
                        closeModal={closeQrModal}
                        shortUrl={link}
                    />
                }
                isModalOpen={isQrModalOpen}
                styles={{
                    padding: '0px',
                }}
            />
            <Modal
                modalContent={
                    <DeleteModal
                        projectId={_id}
                        closeModal={closeDeleteModal}
                    />
                }
                isModalOpen={isDeleteModalOpen}
            />
        </>
    );
};
