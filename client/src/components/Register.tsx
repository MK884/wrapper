import React, { FormEventHandler } from 'react';
import style from '../styles/getStart/register.module.scss';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, ImageInput, PasswordInput, TextInput } from '../ui';
import { login, register as registerUser } from '../services/user';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../app/hook';
import { setUser } from '../features/auth/authSlice';
import { toast } from 'react-toastify';

const schema = z.object({
    fullName: z.string().min(3).trim(),
    email: z.string().email().trim(),
    password: z.string().min(8).trim(),
    avatar: z.instanceof(File).optional(),
});

type formField = z.infer<typeof schema>;

const inoutStyle = {
    backgroundColor: '#2B3036',
    borderColor: '#3C434B',
    color: '#858C94',
};

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {
        register,
        handleSubmit,
        setValue,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<formField>({
        defaultValues: {
            email: '',
            password: '',
            fullName: '',
        },
        resolver: zodResolver(schema),
    });

    const handleRegister: SubmitHandler<formField> = async (data) => {
        try {
            const response = await registerUser(data);

            console.log('register response => ', response);

            const loginData = {
                email: response?.email,
                password: data?.password,
            };
            const loginResponse = await login(loginData);

            console.log('login response => ', loginResponse);

            dispatch(setUser(loginResponse?.userDetails));

            navigate('/', { replace: true });

            toast.success('Register successfully', {
                autoClose: 1000,
            });
        } catch (error) {
            if (error instanceof Error) {
                setError('root', { message: error?.message });
            }
        }
    };

    return (
        <div className={`${style['register-container']}`}>
            <h1>Register</h1>
            <form onSubmit={handleSubmit(handleRegister)}>
                {errors?.root?.message && (
                    <p className="error">{errors?.root?.message}</p>
                )}
                <ImageInput
                    label="Profile Image"
                    onFileSelected={(file) => setValue('avatar', file)}
                />
                <TextInput
                    fullWidth
                    styles={inoutStyle}
                    placeholder="Enter Full Name"
                    type="text"
                    {...register('fullName')}
                />
                {errors?.fullName?.message && (
                    <p className="error">{errors?.fullName?.message}</p>
                )}
                <TextInput
                    fullWidth
                    styles={inoutStyle}
                    placeholder="Enter Email"
                    type="email"
                    {...register('email')}
                />
                {errors?.email?.message && (
                    <p className="error">{errors?.email?.message}</p>
                )}
                <PasswordInput
                    fullWidth
                    styles={inoutStyle}
                    placeholder="Enter Password"
                    {...register('password')}
                />
                {errors?.password?.message && (
                    <p className="error">{errors?.password?.message}</p>
                )}
                <Button
                    label={isSubmitting ? 'Submitting...' : 'Register'}
                    type="submit"
                    styles={{
                        borderColor: '#3C434B',
                    }}
                    fullWidth
                    disabled={isSubmitting}
                />
            </form>
        </div>
    );
};

export default Register;
