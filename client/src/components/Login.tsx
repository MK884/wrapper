import React from 'react';
import style from '../styles/getStart/login.module.scss';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, PasswordInput, TextInput } from '../ui';
import { login } from '../services/user';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../app/hook';
import { setUser } from '../features/auth/authSlice';
import { toast } from 'react-toastify';

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

type formField = z.infer<typeof schema>;

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();

    const redirect_url = location?.state?.from?.pathname ?? '/';

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<formField>({
        defaultValues: {
            email: '',
            password: '',
        },
        resolver: zodResolver(schema),
    });

    const handleUserInput: SubmitHandler<formField> = async (data) => {
        try {
            const response = await login(data);

            if (response?.userDetails) {
                dispatch(setUser(response?.userDetails));
                navigate(redirect_url, { replace: true });
                toast.success("Login successful", {
                    autoClose:1000,
                })
            } else {
                console.error('user Details Not Found');
            }

        } catch (error) {
            if (error instanceof Error)
                setError('root', { message: error?.message });

        }
    };

    return (
        <div className={`${style['login-container']}`}>
            <h1>Login</h1>
            <form
                className={`${style['form']}`}
                onSubmit={handleSubmit(handleUserInput)}
            >
                {errors?.root?.message && (
                    <p className="error">{errors?.root?.message}</p>
                )}
                <TextInput
                    fullWidth
                    styles={{
                        backgroundColor: '#2B3036',
                        borderColor: '#3C434B',
                        color: '#858C94',
                    }}
                    placeholder="Enter Email Address"
                    type="email"
                    {...register('email')}
                />
                {errors?.email?.message && (
                    <p className="error">{errors?.email?.message}</p>
                )}
                <PasswordInput
                    styles={{
                        backgroundColor: '#2B3036',
                        borderColor: '#3C434B',
                        color: '#858C94',
                    }}
                    fullWidth
                    {...register('password')}
                />
                {errors?.password?.message && (
                    <p className="error">{errors?.password?.message}</p>
                )}
                <Button
                    label={isSubmitting ? 'submitting...' : 'Login'}
                    type="submit"
                    styles={{
                        borderColor: '#3C434B',
                    }}
                    disabled={isSubmitting}
                />
            </form>
        </div>
    );
};

export default Login;
