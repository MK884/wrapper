import React from 'react';
import styles from '../styles/wrapper/wrapper.module.scss';
import { Avatar, TextInput } from '../ui';
import { FiUpload } from 'react-icons/fi';
import { BiSolidPencil } from 'react-icons/bi';
import { MdDone } from 'react-icons/md';
import { FaRegTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { isValidHttpsUrl } from '../utils';

interface linksState {
    projectId: number | string;
    link: string;
    domainIcon?: string;
    title?: string;
}

type linksAction =
    | { type: 'ADD_LINK'; payload: Array<linksState> }
    | { type: 'DELETE_LINK'; payload: { projectId: number | string } }
    | {
          type: 'EDIT_LINK';
          payload: {
              projectId: number | string;
              updatedLink: Partial<linksState>;
          };
      };

const linksReducer = (state: Array<linksState> | [], action: linksAction) => {
    switch (action.type) {
        case 'ADD_LINK':
            return [...state, ...action.payload];
        case 'EDIT_LINK':
            return state?.filter((link) =>
                link.projectId === action.payload.projectId
                    ? { ...link, ...action.payload.updatedLink }
                    : link
            );
        case 'DELETE_LINK':
            return state?.filter(
                (link) => link.projectId !== action.payload.projectId
            );

        default:
            throw new Error('Unexpected action type');
    }
};

const Wrapper = () => {
    const [linksState, dispatchLinks] = React.useReducer(linksReducer, []);
    const [name, setName] = React.useState<string>('Merchant Khalid');
    const [isNameEditable, setIsNameEditable] = React.useState<boolean>(false);
    const [isAddLink, setIsAddLink] = React.useState<boolean>(false);
    const [avatar, setAvatar] = React.useState<string | null>(null);
    const [link, setLink] = React.useState<string>('');
    const [linkError, setLinkError] = React.useState<boolean>(false);

    const fileRef = React.useRef<HTMLInputElement>(null);
    const linkRef = React.useRef<HTMLInputElement>(null);

    const navigate = useNavigate();

    const changeName = () => {
        setIsNameEditable((prev) => !prev);
    };

    const addAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e?.target?.files?.[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => setAvatar(e?.target?.result as string);

        reader.readAsDataURL(file);
    };

    React.useEffect(() => {
        if (isAddLink) linkRef?.current?.focus();

        const hideLinkInput = (e: MouseEvent) => {
            if (linkRef?.current?.contains(e.target as Node)) return;
            isAddLink && setIsAddLink(false);
        };

        // document.addEventListener('click',hideLinkInput);

        // return () => document.removeEventListener('click',hideLinkInput);
    }, [isAddLink]);

    const clearAvatar = () => setAvatar(null);

    const triggerFileInput = () => fileRef?.current?.click();

    const linkHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLinkError(false);

        const { value } = e.target;
        setLink(value);

        if (!isValidHttpsUrl(value)) return setLinkError(true);

        dispatchLinks({
            type: 'ADD_LINK',
            payload: [
                {
                    link: value,
                    projectId: Math.floor(Math.random() * 10),
                    domainIcon:
                        'https://www.google.com/s2/favicons?sz=64&domain_url=www.youtube.com',
                    title: 'Youtube',
                },
            ],
        });

        setIsAddLink(false);
        setLink('');
    };

    const deleteLink = (projectId: number | string) =>
        dispatchLinks({ type: 'DELETE_LINK', payload: { projectId } });

    return (
        <div className={styles['main']}>
            <div className={styles['profile']}>
                {avatar ? (
                    <div className={styles['avatar_profile']}>
                        <Avatar
                            size="lg"
                            className={styles['avatar']}
                            src={avatar}
                        />
                        <button
                            className={styles['delete_avatar']}
                            onClick={clearAvatar}
                        >
                            <FaRegTrashAlt />
                        </button>
                        <button
                            className={styles['edit_avatar']}
                            onClick={triggerFileInput}
                        >
                            <FiUpload />
                        </button>
                    </div>
                ) : (
                    <button
                        className={styles['add_avatar']}
                        onClick={triggerFileInput}
                    >
                        <FiUpload />
                        <p>Add Avatar</p>
                    </button>
                )}
                <div className={styles['name']}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={!isNameEditable}
                        placeholder="Your Name"
                    />
                    <button
                        className={styles['edit_name']}
                        onClick={changeName}
                    >
                        {isNameEditable ? <MdDone /> : <BiSolidPencil />}
                    </button>
                </div>
                <textarea
                    className={styles['bio']}
                    placeholder="Write your bio..."
                />
                <input
                    type="file"
                    ref={fileRef}
                    onChange={addAvatar}
                    style={{ display: 'none' }}
                />
            </div>
            <div className={styles['links']}>
                {linksState?.map((link, idx) => (
                    <div className={styles['link']}>
                        <div
                            key={link.projectId}
                            className={styles['box']}
                            onClick={() => navigate(link?.link)}
                        >
                            <Avatar size="md" src={link?.domainIcon} />
                            <div className={styles['inputs']}>
                                <input
                                    type="text"
                                    className={styles['link_title']}
                                    placeholder="Link title"
                                />
                            </div>
                        </div>
                        <button
                            className={styles['delete_link']}
                            onClick={() => deleteLink(link.projectId)}
                        >
                            <FaRegTrashAlt />
                        </button>
                    </div>
                ))}
                <p
                    style={{
                        textAlign: 'center',
                        color: 'var(--text-brand)',
                        cursor: 'pointer',
                        fontSize: 'small',
                        width: 'fit-content',
                    }}
                    onClick={() => setIsAddLink(true)}
                >
                    Add Link
                </p>
                {isAddLink && (
                    <TextInput
                        ref={linkRef}
                        placeholder={'https:://wrapper.com'}
                        value={link}
                        onChange={linkHandler}
                    />
                )}
            </div>
        </div>
    );
};

export default Wrapper;
