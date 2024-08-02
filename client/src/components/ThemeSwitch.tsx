import { Switch } from '../ui';
import { useTheme } from '../hook';

const ThemeSwitch = () => {
    const theme = useTheme();
    const checked = theme?.theme === 'dark';

    return <Switch onChange={theme?.toggleTheme} isChecked={checked} />;
};

export default ThemeSwitch;
