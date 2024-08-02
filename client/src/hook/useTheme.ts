import { useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

const useTheme = () => {
    const getPreferredTheme = () =>
        window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : ('light' as Theme);

    const initializeTheme = () => {
        const savedTheme = localStorage.getItem('wrapper-theme') as Theme;
        if (savedTheme) return savedTheme;
        let preferTheme = getPreferredTheme();
        localStorage.setItem('wrapper-theme', preferTheme);
        return preferTheme;
    };

    const [theme, setTheme] = useState<Theme>(initializeTheme || 'dark');

    const toggleTheme = () => {
        let newTheme = theme === 'dark' ? 'light' : ('dark' as Theme);
        setTheme(newTheme);
        localStorage.setItem('wrapper-theme', newTheme);
    };

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);

        return () => document.documentElement.removeAttribute('data-theme');
    }, [theme]);

    return { theme, toggleTheme };
};

export default useTheme;
