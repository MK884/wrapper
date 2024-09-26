import React from 'react';
interface PaginationProps {
    activePage?: number;
    setActivePage: React.Dispatch<React.SetStateAction<number>>;
    tottalPage: number;
}
import styles from '../styles/pagination/pagination.module.scss';
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";

function Pagination({
    setActivePage,
    tottalPage,
    activePage = 0,
}: PaginationProps) {


    const goToPage = (index:number) =>{
        setActivePage(index)
    }

    return (
        <div className={styles['container']}>
           <button disabled={activePage < 1} className={styles['pg__btn']} style={{backgroundColor: 'var(--page-weak)', color: '#dadada'}} onClick={()=>goToPage(activePage-1)}><IoIosArrowBack/></button>
            {Array(tottalPage)
                .fill(null)
                ?.map((_, i) => (
                    <>
                        <button
                            onClick={() => goToPage(i)}
                            className={`${styles['pg__btn']} ${styles[activePage === i ? 'active': '']}`}
                        >
                            {i + 1}
                        </button>
                    </>
                ))}
            <button disabled={activePage >= tottalPage -1} className={styles['pg__btn']} style={{backgroundColor: 'var(--page-weak)', color: '#dadada'}} onClick={()=>goToPage(activePage+1)}><IoIosArrowForward /></button>
        </div>
    );
}

export default Pagination;
