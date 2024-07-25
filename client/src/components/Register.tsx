import React, { FormEventHandler } from 'react';
import style from '../styles/getStart/register.module.scss';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, ImageInput, PasswordInput, TextInput } from 'ui';

const schema = z.object({
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8),
    image: z.instanceof(File).optional(),
});


type formField = z.infer<typeof schema>;

const inoutStyle = {
    backgroundColor: '#2B3036',
    borderColor: '#3C434B',
    color: '#858C94',
};

const Register = () => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<formField>({
        defaultValues: {
            email: '',
            password: '',
            username: '',
        },
        resolver: zodResolver(schema),
    });

    const handleRegister: SubmitHandler<formField> = async (data) => {
        await new Promise((resolve, reject) => setTimeout(resolve, 2000));
        console.log(data);
    };

    return (
        <div className={`${style['register-container']}`}>
            <h1>Register</h1>
            <form onSubmit={handleSubmit(handleRegister)}>
                <ImageInput
                    label="Profile Image"
                    onFileSelected={(file) => setValue('image', file)}
                />
                <TextInput
                    fullWidth
                    styles={inoutStyle}
                    placeholder="Enter Full Name"
                    type="text"
                    {...register('username')}
                />
                {errors?.username?.message && (
                    <p className="error">{errors?.username?.message}</p>
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
