import { MainMenu, ProfileMenu } from "components"
import styles from "../styles/layout/layout.module.scss"

const Header = () => {
  return (
    <header className={styles.header}>
        <MainMenu />
        <ProfileMenu />
    </header>
  )
}

export default Header