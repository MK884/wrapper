import style from '../styles/loaders/loader.module.scss';

export const Loader = () => {
    return (
        <div className={style['loader']}>
            <span className={style['circle']}></span>
            <span className={style['circle']}></span>
            <span className={style['circle']}></span>
            <span className={style['circle']}></span>
        </div>
    );
};

export const BarLoader = () => {
    return (
        <div className={style['bar-loader']}>
            <span className={style['bar']}></span>
            <span className={style['bar']}></span>
            <span className={style['bar']}></span>
        </div>
    );
};


export const ColorLoader = () =>{
    return <div className={style['color-loader']}></div>
}
