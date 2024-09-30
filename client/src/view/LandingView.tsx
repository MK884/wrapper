
import { useNavigate } from 'react-router-dom';
import styles from '../styles/landing.module.scss';

import { FaGithub } from 'react-icons/fa';
import { showcaseData, technologies } from '../constant';

function LandingView() {
    const navigate = useNavigate();

    const goToLogin = () => navigate('/get-start');

    return (
        <>
            <main className={styles.main}>
                <header>
                    <nav>
                        <img src="./logo.png" alt="wrapper" />
                        <button onClick={goToLogin}>Get Started</button>
                    </nav>
                </header>
                <section>
                    <div className={styles['section_1']}>
                        <h1>Track your social presence</h1>
                        <p>
                            {' '}
                            Wrapper streamlines link management and, giving you
                            the control to elevate your online presence
                            effortlessly.
                        </p>
                        <div>
                            <a
                                href="https://github.com/MK884/wrapper"
                                target="_blank"
                            >
                                <button>
                                    <FaGithub size={20} />
                                    Star us on Github
                                </button>
                            </a>
                            <button onClick={goToLogin}>Get Started</button>
                        </div>
                    </div>
                </section>
                {showcaseData?.map((data) => (
                    <section key={data?.id}>
                        <div className={styles[`section_${data.id + 1}`]}>
                            <div className={styles['wrapper']}>
                                <div className={styles['text']}>
                                    <h3>{data?.titel}</h3>
                                    <p>{data?.description}</p>
                                </div>
                                <div
                                    className={`${styles[`ss${data?.id + 1}`]} ${styles.image}`}
                                >
                                    <img src={data?.imgSrc} alt={data?.alt} />
                                </div>
                            </div>
                        </div>
                    </section>
                ))}
                <section className={styles.tech}>
                    <h4>Tech Stack</h4>
                    <p>
                        Wrapper is built on MERN Stack. Some of technology are
                        listed below
                    </p>
                    <div className={styles.box}>
                        {technologies?.map((tech) => (
                            <div className={styles.card} key={tech?.id}>
                                <div>{tech?.icon}</div>
                                <h3>{tech?.title}</h3>
                                <p>{tech?.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </>
    );
}

export default LandingView;
