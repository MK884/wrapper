import React, { useEffect, useRef } from 'react';
import style from '../styles/toolMenu/tool.module.scss';
import { IoMenu } from 'react-icons/io5';
import { ToolMenuWrapperProps, ToolOptionsProps } from 'interface';

export const ToolOptions = ({
    label,
    Icon,
    styles = {},
    IconStyles = {},
    indicator,
    hoverEffect = true,
    active = false,
    onClick,
}: ToolOptionsProps) => {
    return (
        <>
            <li
                style={styles}
                className={`${hoverEffect && style['li-hover']} ${active && style['li-active']}`}
                onClick={onClick}
            >
                <div className={`${style['info']}`}>
                    {Icon && <Icon style={IconStyles} />}
                    <div className={`${style['label']}`}>{label}</div>
                </div>
                {indicator && (
                    <div className={`${style['indicator']}`}> {indicator}</div>
                )}
            </li>
        </>
    );
};

const ToolMenuWrapper = ({
    header,
    direction = 'ltr',
    children,
}: ToolMenuWrapperProps) => {
    const [display, setDisplay] = React.useState(false);
    const bodyRef = useRef<HTMLDivElement>(null);
    const handleMenuClick = () => {
        setDisplay((display) => (display ? false : true));
    };

    const handleMenuClickOutside = (e: Event) => {
        if (bodyRef?.current && !bodyRef?.current.contains(e.target as Node)) {
            setDisplay(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleMenuClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleMenuClickOutside);
        };
    }, []);
    return (
        <>
            <div
                ref={bodyRef}
                className={`${style['tool-wrapper']}`}
                style={{
                    direction: direction,
                }}
            >
                <div
                    onClick={handleMenuClick}
                    className={`${style['tool-header-wrapper']}`}
                >
                    {header ? (
                        header
                    ) : (
                        <div className={`${style['tool-header']}`}>
                            <IoMenu />
                        </div>
                    )}
                </div>

                {children && (
                    <ul
                        className={`${style['tool-body']} ${display && style[`tool-body-active`]}`}
                    >
                        {children}
                    </ul>
                )}
            </div>
        </>
    );
};

export default ToolMenuWrapper;
