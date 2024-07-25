import React from 'react';
import style from '../styles/getStart/login.module.scss';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, PasswordInput, TextInput } from 'ui';

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

type formField = z.infer<typeof schema>;

const Login = () => {
    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting, isSubmitSuccessful },
    } = useForm<formField>({
        defaultValues: {
            email: '',
            password: '',
        },
        resolver: zodResolver(schema),
    });

    const handleUserInput: SubmitHandler<formField> = async (data) => {
        try {
            await new Promise((resolve, reject) => setTimeout(resolve, 1000));
            console.log(data);
        } catch (error) {
            if (error) {
                setError('email', { message: 'Email is not found' });
            }
        }
    };

    React.useEffect(() => {
        reset();
    }, [isSubmitSuccessful]);

    return (
        <div className={`${style['login-container']}`}>
            <h1>Login</h1>
            <form
                className={`${style['form']}`}
                onSubmit={handleSubmit(handleUserInput)}
            >
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
