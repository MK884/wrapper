import { SwitchProps } from 'interface';
import style from '../styles/switch/switch.module.scss';

const Switch = ({
    id = '',
    styles = {},
    varaints = 'sm',
    onChange,
    isChecked,
    ...props
}: SwitchProps) => {
    return (
        <input
            type="checkbox"
            onChange={onChange}
            id={id}
            style={styles}
            checked={isChecked}
            className={`${style.switch} ${style.switch}-${varaints}`}
            {...props}
        />
    );
};

export default Switch;
