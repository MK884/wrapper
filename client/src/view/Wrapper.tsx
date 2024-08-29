import React from 'react';
import styles from '../styles/wrapper/wrapper.module.scss';
import { Avatar, TextInput } from '../ui';
import { FiUpload } from 'react-icons/fi';
import { BiSolidPencil } from 'react-icons/bi';
import { MdDone } from 'react-icons/md';
import { FaRegTrashAlt } from 'react-icons/fa';


const Wrapper = () => {
    const [links, setLinks] = React.useState<number>(4);
    const [name, setName] = React.useState<string>('Merchant Khalid');
    const [isNameEditable, setIsNameEditable] = React.useState<boolean>(false);
    const [isAddLink, setIsAddLink] = React.useState<boolean>(false);
    const [avatar, setAvatar] = React.useState<string | null>(null);

    const fileRef = React.useRef<HTMLInputElement>(null);
    const linkRef = React.useRef<HTMLInputElement>(null);

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


    React.useEffect(()=>{
        
        if(isAddLink) linkRef?.current?.focus();

        const hideLinkInput = (e:MouseEvent) =>{
            if(linkRef?.current?.contains(e.target as Node)) return;
            isAddLink && setIsAddLink(false)
        }

        // document.addEventListener('click',hideLinkInput);

        // return () => document.removeEventListener('click',hideLinkInput);
    },[isAddLink])

    const clearAvatar = () => setAvatar(null);

    const triggerFileInput = () => fileRef?.current?.click();

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
                    <button className={styles['delete_avatar']} onClick={clearAvatar}>
                        <FaRegTrashAlt />
                    </button>
                    <button className={styles['edit_avatar']} onClick={triggerFileInput}>
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
                        placeholder='Your Name'
                    />
                    <div className={styles['edit_name']} onClick={changeName}>
                        {isNameEditable ? <MdDone /> : <BiSolidPencil />}
                    </div>
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
                {
                    Array(links).fill(null)?.map((_,idx)=> <div key={idx} className={styles['box']}>
                        <Avatar size='md'/>
                        <div className={styles['inputs']}>
                            <input type="text" className={styles['link_title']} placeholder='Link title'/>
                        </div>
                    </div>)
                }
                <p
                    style={{
                        textAlign: 'center',
                        color: 'var(--text-brand)',
                        cursor: 'pointer',
                        fontSize: 'small',
                        width: 'fit-content',
                    }}
                    onClick={()=> setIsAddLink(true)}
                >
                    Add Link
                </p>
                {isAddLink && <TextInput ref={linkRef} placeholder={'https:://wrapper.com'} />}
            </div>
        </div>
    );
};

export default Wrapper;
