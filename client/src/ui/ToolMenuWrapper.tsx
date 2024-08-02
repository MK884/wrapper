import React, { useEffect, useRef } from 'react';
import style from '../styles/toolMenu/tool.module.scss';
import { IoMenu } from 'react-icons/io5';
import { ToolMenuWrapperProps, ToolOptionsProps } from 'interface';

export const ToolOptions = React.forwardRef(({
    label,
    Icon,
    styles = {},
    IconStyles = {},
    indicator,
    hoverEffect = true,
    active = false,
    onClick,
}: ToolOptionsProps, ref?:any) => {
    return (
        <>
            <li
                style={styles}
                className={`${hoverEffect && style['li-hover']} ${active && style['li-active']}`}
                onClick={onClick}
                ref={ref}
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
});

const ToolMenuWrapper = ({
    header,
    direction = 'ltr',
    children,
    setIsMenuVisible,
    isMenuVisible
}: ToolMenuWrapperProps) => {
    const bodyRef = useRef<HTMLDivElement>(null);
    const handleMenuClick = () => {
        setIsMenuVisible((prev) => (prev ? false : true));
    };

    const handleMenuClickOutside = (e: Event) => {
        if (bodyRef?.current && !bodyRef?.current.contains(e.target as Node)) {
            setIsMenuVisible(false);
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
                        className={`${style['tool-body']} ${isMenuVisible === true ? style[`tool-body-active`] : ''}`}
                    >
                        {children}
                    </ul>
                )}
            </div>
        </>
    );
};

export default ToolMenuWrapper;
