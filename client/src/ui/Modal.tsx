import React from 'react';
import style from '../styles/modal/modal.module.scss';

interface ModalProps {
    isModalOpen:boolean;
    modalContent:any
    styles?: React.CSSProperties
}

const Modal = ({isModalOpen=false, modalContent, styles={}}:ModalProps, ref:any) => {
   

    if(!isModalOpen || !modalContent) return

    return (
        <div className={style['modal-wrapper']}>
            <div className={style['modal']} ref={ref} style={styles}>
               {modalContent}
            </div>
        </div>
    );
};

export default React.forwardRef(Modal);
