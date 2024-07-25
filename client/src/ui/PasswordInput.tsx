import { PasswordInputProps } from 'interface';
import style from '../styles/input/passwordInput.module.scss';
import { FaEyeSlash } from 'react-icons/fa';
import { FaEye } from 'react-icons/fa';
import React from 'react';

const PasswordInput = ({
    fullWidth = false,
    onChange,
    placeholder = 'Enter Password',
    styles = {},
    name,
    value,
    ...props
}: PasswordInputProps, ref:any) => {
    const [showPassword, setshowPassword] = React.useState<boolean>(false);

    const handleChange = () => {
        setshowPassword((input) => !input);
    };


    return (
        <div
            className={`${style['input-wrapper']} ${fullWidth && style['input-wrapper-fullWidth']}`}
            
        >
            <input
                ref={ref}
                type={showPassword ? 'text' : 'password'}
                name={name}
                value={value}
                style={styles}
                onChange={onChange}
                placeholder={placeholder}
                className={`${style['textInput']} ${fullWidth && style['textInput-fullWidth']}`}
                {...props}
            />
            <div className={style['icon']} onClick={handleChange}>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
            </div>
        </div>
    );
};

export default React.forwardRef(PasswordInput);
