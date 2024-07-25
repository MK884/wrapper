import { ButtonProps } from 'interface';
import style from '../styles/button/button.module.scss';

const Button = ({
    type = 'button',
    label,
    styles = {},
    onclick,
    fullWidth = false,
    Icon,
    IconStyle = {},
    disabled = false,
    variant = 'defualt',
    props
}: ButtonProps) => {
    return (
        <button
            disabled={disabled}
            type={type}
            style={styles}
            onClick={onclick}
            className={`${style['button']} ${fullWidth && style[`button-fullWidth`]} ${style[`button-${variant}`]}`}
            {...props}
        >
            {Icon && <Icon style={IconStyle} />}
            {label}
        </button>
    );
};

export default Button;
