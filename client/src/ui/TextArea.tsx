import { TextTextAreaProps } from 'interface';
import style from '../styles/input/inputText.module.scss';
import React from 'react';

const TextArea = (
    {
        fullWidth = false,
        onChange,
        placeholder = 'Enter Input',
        styles = {},
        name,
        value,
        ...props
    }: TextTextAreaProps,
    ref: any
) => {
    return (
        <>
        <textarea
            name={name}
            value={value}
            onChange={onChange}
            style={styles}
            placeholder={placeholder}
            className={`${style['textInput']} ${fullWidth && style['textInput-fullWidth']}`}
            {...props}
            ref={ref}
        />
        
</>
    );
};

export default React.forwardRef(TextArea);
