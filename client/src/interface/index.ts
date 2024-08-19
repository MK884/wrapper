import { Dispatch, MouseEventHandler, SetStateAction } from 'react';
import { IconType } from 'react-icons';

export interface SwitchProps {
    styles?: React.CSSProperties;
    id?: string;
    varaints?: 'sm' | 'md' | 'lg';
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isChecked?: boolean;
    [key:string]:any
}

export interface TextInputProps {
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: 'text' | 'email' | 'number';
    styles?: React.CSSProperties;
    fullWidth?: boolean;
    value?: string;
    name?: string;
    [key: string]: any;
}
export interface TextTextAreaProps {
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    styles?: React.CSSProperties;
    fullWidth?: boolean;
    value?: string;
    name?: string;
    [key: string]: any;
}

export interface AvatarProps {
    src?: string;
    alt?: string;
    styles?: React.CSSProperties;
    size?: 'sm' | 'md' | 'lg';
    onClick?: () => void;
    string?: string;
    className?:string,
}

export interface AvatarGrpProps {
    avatars: AvatarProps[];
    size?: 'sm' | 'md' | 'lg';
}

export interface ButtonProps {
    label?: string;
    fullWidth?: boolean;
    type?: 'button' | 'submit' | 'reset';
    onclick?: () => void;
    styles?: React.CSSProperties;
    Icon?: IconType;
    IconStyle?: React.CSSProperties;
    disabled?: boolean;
    variant?: 'defualt' | 'danger' | 'success' | 'warning';
    [key:string]:any
}

export interface ToolOptionsProps {
    label: string;
    Icon?: IconType;
    styles?: React.CSSProperties;
    IconStyles?: React.CSSProperties;
    indicator?: any;
    onClick?: () => void;
    hoverEffect?: boolean;
    active?: boolean;
}

export interface ToolMenuWrapperProps {
    header?: any;
    direction?: 'ltr' | 'rtl';
    children?: any;
    setIsMenuVisible: Dispatch<React.SetStateAction<boolean>> 
    isMenuVisible: boolean
}

export interface ImageInputProps {
    label?: string;
    styles?:React.CSSProperties;
    onFileSelected?: (file: File | undefined) => void;
    [key:string]:any
}

export interface PasswordInputProps {
    fullWidth?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    styles?: React.CSSProperties;
    name?: string;
    value?: string;
    [key: string]: any;
}


export interface CardContainerProps {
    _id: string;
    shortUrl: string;
    originalUrl?: string;
    domainIcon: string;
    clicks: number;
    updatedAt?: string;
    isCustomized: boolean;
    title?:string;
    description?:string;
    image?: string;
    domain?:string
}

export type ChartType =
| 'line'
| 'area'
| 'bar'
| 'pie'
| 'donut'
| 'radialBar'
| 'scatter'
| 'bubble'
| 'heatmap'
| 'candlestick'
| 'boxPlot'
| 'radar'
| 'polarArea'
| 'rangeBar'
| 'rangeArea'
| 'treemap';