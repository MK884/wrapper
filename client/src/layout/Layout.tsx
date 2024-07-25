import { Outlet } from 'react-router-dom';
import Header from './Header';
import styles from "../styles/layout/layout.module.scss"

const Layout = () => {
    return (
        <div className={styles.layout}>
            <Header />
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
