import React from 'react'
import style from '../styles/container.module.scss';

interface ContainerProps{
  children:React.ReactNode,
  styles?: React.CSSProperties,
  className?:string,
  hoverEffect?:boolean;
  [key:string]:any
}

const Container = ({children, styles={},className, hoverEffect=true, ...rest}:ContainerProps) => {
  return (
    <div className={`${style[`container`]} ${hoverEffect ? style['hover-active'] : ''} ${className}`} style={styles} {...rest}>{
      children
    }</div>
  )
}

export default Container