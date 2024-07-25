import React from 'react';
import { Switch } from 'ui';

type Theme = 'light' | 'dark';

const ThemeSwitch = () => {
    const [theme, setTheme] = React.useState<Theme>(
        (localStorage.getItem('wrapper-theme') as Theme) || 'dark'
    );

    const ChangeTheme = () => {
        let newTheme = theme === 'light' ? 'dark' : ('light' as Theme);
        setTheme(newTheme);
        localStorage.setItem('wrapper-theme', newTheme);
    };

    React.useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        return () => {
            document.documentElement.removeAttribute('data-theme');
        };
    }, [theme]);

    const checked = theme === 'dark';

    return <Switch onChange={ChangeTheme} isChecked={checked} />;
};

export default ThemeSwitch;
