import React, { Dispatch, SetStateAction } from 'react';
import style from '../styles/setting/setting.module.scss';
import Container from '../ui/Container';
import { Avatar, Button, Modal, TextInput } from '../ui';
import { useAppDispatch, useAppSelector } from '../app/hook';
import { setUser, useUser, logout } from '../features/auth/authSlice';
import { z } from 'zod';
import { IoClose } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { usePrivateAxios } from '../services/api';
import { deleteUser, updateAvatar, updateDetails } from '../services/user';

const DeleteConfirmation = ({
    setisModalOpen,
    avatar,
    fullName,
}: {
    setisModalOpen: Dispatch<SetStateAction<boolean>>;
    avatar?: string;
    fullName?: string;
}) => {
    const [input, setInpput] = React.useState<String>('');
    const [isDisable, setIsDisable] = React.useState<boolean>(true);

    const privateAxios = usePrivateAxios();
    const dispatch = useAppDispatch();

    const handleDisable = () => {
        if (input?.toLocaleLowerCase() === 'delete my account')
            setIsDisable(false);
        else setIsDisable(true);
    };

    const deleteAcount = async () => {

        setisModalOpen(false)

        try {
            const respnse = await deleteUser(privateAxios);

            dispatch(logout())
            console.log(respnse);

            toast.success('Account deleted successfully', { autoClose: 2000, toastId: 'unautherized' });
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error?.message, {
                    autoClose: 3000,
                });
                console.error(error);
            }
        }
    };

    React.useEffect(() => {
        handleDisable();

        return () => handleDisable();
    }, [input]);

    return (
        <>
            <div className={style['delete-wrapper']}>
                <div className={style['header']}>
                    <h4>Delete Account</h4>
                    <IoClose
                        cursor="pointer"
                        style={{
                            height: '1vmax',
                            width: '1vmax',
                            borderRadius: '50%',
                            background: 'transparent',
                        }}
                        onClick={() => setisModalOpen(false)}
                    />
                </div>
                <div className={style['content']}>
                    <Avatar size="lg" src={avatar} string={fullName} />

                    <span>{fullName}</span>
                    <p>
                        Warning: This will permanently delete your account, and
                        all your project's.
                    </p>
                </div>
                <div className={style['footer']}>
                    <p>
                        To confirm, type <strong>"delete my account"</strong> in
                        the box below
                    </p>
                    <TextInput
                        fullWidth
                        placeholder=""
                        value={input}
                        onChange={(e: any) => setInpput(e?.target?.value)}
                    />
                    <Button
                        fullWidth
                        label="Delete My Account"
                        variant="danger"
                        disabled={isDisable}
                        onclick={deleteAcount}
                    />
                </div>
            </div>
        </>
    );
};

const Setting = () => {
    const fileRef = React.useRef<HTMLInputElement | null>(null);
    const user = useAppSelector(useUser);
    const dispatch = useAppDispatch();
    const privateAxios = usePrivateAxios();
    const modalRef = React.useRef<HTMLDivElement>(null);
    const [isModalOpen, setisModalOpen] = React.useState<boolean>(false);

    const [values, setValues] = React.useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
    });

    const schema = z.object({
        fullName: z.string().min(6, 'Must contain at least 6 character(s)'),
        email: z.string().email(),
    });

    const [error, setError] = React.useState({
        fullName: '',
        email: '',
    });

    const [disablefullName, setDisablefullName] = React.useState(true);
    const [disableEmail, setDisableEmail] = React.useState(true);


    const [isLoadingAvatar, setIsLoadingAvatar] = React.useState<boolean>(false);
    const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e?.target?.files?.[0];
        if (!file) return;
        setIsLoadingAvatar(true)
        try {
            const response = await updateAvatar(file, privateAxios);

            let newAvatar = response?.data?.avatar?.avatar;

            if (user) {
                dispatch(
                    setUser({
                        ...user,
                        avatar: newAvatar,
                    })
                );
            }

            toast.success('Avatar updated successfully', {
                autoClose: 3000,
            });
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error?.message, {
                    autoClose: 3000,
                });
            }
            console.error(error);
        }finally{
            setIsLoadingAvatar(false)
        }
    };

    const handleInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues((prev) => ({
            ...prev,
            [name]: value,
        }));
        const { error } = schema.safeParse(values);
        setError({
            fullName: '',
            email: '',
        });
        if (error) {
            let emailError = error?.formErrors?.fieldErrors?.email?.[0];
            let fullNameError = error?.formErrors?.fieldErrors?.fullName?.[0];
            setError({
                fullName: fullNameError || '',
                email: emailError || '',
            });
        }
    };

    const submitValues = async () => {
        if (error?.email.length || error?.fullName.length) return;
        const userData: { [key: string]: string } = {};

        if (!disableEmail) userData.email = values?.email;
        if (!disablefullName) userData.fullName = values?.fullName;

        try {
            const response = await updateDetails(userData, privateAxios);
            console.log(response?.data);
            if (user) {
                dispatch(
                    setUser({
                        ...user,
                        email: response?.data?.email,
                        fullName: response?.data?.fullName,
                    })
                );
            }

            toast.success('User Details Updated Successfully ', {
                autoClose: 3000,
            });
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error?.message, {
                    autoClose: 3000,
                });
                console.error(error);
            }
        }
    };

    const handleDelete = () => {
        setisModalOpen(true);
    };

    const closeModal = (e: Event) => {
        if (
            modalRef?.current &&
            !modalRef?.current?.contains(e?.target as Node)
        )
            setisModalOpen(false);
    };

    React.useEffect(() => {
        setDisablefullName(
            !(values.fullName !== '' && values.fullName !== user?.fullName)
        );
        setDisableEmail(!(values.email !== '' && values.email !== user?.email));

        return () => {
            setDisablefullName(true);
            setDisableEmail(true);
        };
    }, [user, values]);

    React.useEffect(() => {
        document.addEventListener('mousedown', closeModal);

        return () => removeEventListener('mousedown', closeModal);
    }, []);

    return (
        <>
            <div className={style['setting-page']}>
                <Container
                    className={style['profile-container']}
                    hoverEffect={false}
                >
                    <Avatar
                        src={user?.avatar}
                        string={user?.fullName}
                        styles={{
                            height: '10rem',
                            width: '10rem',
                            fontSize: '-webkit-xxx-large',
                        }}
                    />
                    <input
                        type="file"
                        style={{ display: 'none' }}
                        ref={fileRef}
                        accept="image/*"
                        onChange={handleFileInput}
                    />
                    <Button
                        label={isLoadingAvatar ? "Processing..." : "Change Avatar"}
                        fullWidth
                        onclick={() => fileRef?.current?.click()}
                    />
                </Container>
                <Container
                    hoverEffect={false}
                    className={style['setting-container']}
                >
                    <p>Profile Settings</p>
                    <div className={style['field-container']}>
                        <h4>Your Name</h4>
                        <p>This will be your display name on Wrapper</p>
                        <div className={style['inputs']}>
                            <TextInput
                                fullWidth
                                placeholder={'Your Name'}
                                value={values?.fullName}
                                onChange={handleInputs}
                                name="fullName"
                            />
                            <Button
                                label="Change"
                                disabled={disablefullName}
                                onclick={submitValues}
                            />
                        </div>
                        {error?.fullName !== '' && (
                            <p className="error">{error?.fullName}</p>
                        )}
                    </div>
                    <div className={style['field-container']}>
                        <h4>Your Email</h4>
                        <p>
                            This will be the email you use to log in to Wrapper
                            and receive notifications.
                        </p>
                        <div className={style['inputs']}>
                            <TextInput
                                fullWidth
                                type="email"
                                placeholder={'Your Email'}
                                value={values?.email}
                                name="email"
                                onChange={handleInputs}
                            />
                            <Button
                                label="Change"
                                disabled={disableEmail}
                                onclick={submitValues}
                            />
                        </div>

                        {error?.email !== '' && (
                            <p className="error">{error?.email}</p>
                        )}
                    </div>
                    <div className={style['field-container']}>
                        <h4>Delete Account</h4>
                        <p>
                            Permanently delete your Wrapper account, Projects
                            and their respective stats. This action cannot be
                            undone - please proceed with caution.
                        </p>
                        <div className={style['inputs']}>
                            <Button
                                label="Delete"
                                variant="danger"
                                onclick={handleDelete}
                            />
                        </div>
                    </div>
                </Container>
            </div>
            <Modal
                isModalOpen={isModalOpen}
                modalContent={
                    <DeleteConfirmation
                        setisModalOpen={setisModalOpen}
                        fullName={user?.fullName}
                        avatar={user?.avatar}
                    />
                }
                ref={modalRef}
                styles={{
                    padding: '0px',
                }}
            />
        </>
    );
};

export default Setting;
