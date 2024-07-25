import { TextInputProps } from 'interface';
import style from '../styles/input/inputText.module.scss';
import React from 'react';

const TextInput = ({
    fullWidth = false,
    onChange,
    placeholder = 'Enter Input',
    styles = {},
    type = 'text',
    name,
    value,
    ...props
}: TextInputProps, ref:any) => {
    return (
        <input
            name={name}
            value={value}
            style={styles}
            onChange={onChange}
            placeholder={placeholder}
            type={type}
            className={`${style['textInput']} ${fullWidth && style['textInput-fullWidth']}`}
            {...props}
            ref={ref}
        />
    );
};

export default React.forwardRef(TextInput);
