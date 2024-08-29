import { TextInputProps } from 'interface';
import style from '../styles/input/inputText.module.scss';
import React from 'react';

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
    (
        {
            fullWidth = false,
            onChange,
            placeholder = 'Enter Input',
            styles = {},
            type = 'text',
            name,
            value,
            customeClass,
            ...props
        },
        ref
    ) => {
        return (
            <input
                name={name}
                value={value}
                style={styles}
                onChange={onChange}
                placeholder={placeholder}
                type={type}
                className={`${style['textInput']} ${fullWidth && style['textInput-fullWidth']} ${customeClass}`}
                {...props}
                ref={ref}
            />
        );
    }
);

export default TextInput;
