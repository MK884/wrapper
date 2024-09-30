import React from 'react';

import styles from '../styles/landing.module.scss';
import { useNavigate } from 'react-router-dom';

function LandingView() {
    const navigate = useNavigate();

    const goToLogin = () => navigate('/get-start');

    return (
        <>
            <main className={styles.main}>
                <header>
                    <nav>
                        <h4 className={styles['site-title']}>wrapper</h4>
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
                        <button onClick={goToLogin}>Get Started</button>
                    </div>
                </section>
                <section>
                    <div className={styles['section_2']}>
                        <div className={styles['wrapper']}>
                            <div className={styles['text']}>
                                <h3>Customized link preview</h3>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur
                                    adipisicing elit. Quae accusantium rerum
                                    mollitia dicta nesciunt nihil neque nostrum
                                    perspiciatis voluptates dolorum, suscipit
                                    eum nobis fugiat aspernatur maiores? Esse
                                    vero odit dicta?
                                </p>
                            </div>
                            <div className={`${styles.ss1} ${styles.image}`}>
                                <img src="./ss4.png" alt="home page" />
                            </div>
                        </div>
                    </div>
                </section>
                <section>
                <div className={styles['section_3']}>
                        <div className={styles['wrapper']}>
                            <div className={styles['text']}>
                                <h3>Better Analysis</h3>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur
                                    adipisicing elit. Quae accusantium rerum
                                    mollitia dicta nesciunt nihil neque nostrum
                                    perspiciatis voluptates dolorum, suscipit
                                    eum nobis fugiat aspernatur maiores? Esse
                                    vero odit dicta?
                                </p>
                            </div>
                            <div className={`${styles.ss2} ${styles.image}`}>
                                <img src="./ss2.png" alt="home page" />
                            </div>
                        </div>
                    </div>
                </section>
                <section>
                <div className={styles['section_4']}>
                        <div className={styles['wrapper']}>
                            <div className={styles['text']}>
                                <h3>Dashboard</h3>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur
                                    adipisicing elit. Quae accusantium rerum
                                    mollitia dicta nesciunt nihil neque nostrum
                                    perspiciatis voluptates dolorum, suscipit
                                    eum nobis fugiat aspernatur maiores? Esse
                                    vero odit dicta?
                                </p>
                            </div>
                            <div className={`${styles.ss3} ${styles.image}`}>
                                <img src="./ss1.png" alt="home page" />
                            </div>
                        </div>
                    </div>
                </section>
                <section>
                <div className={styles['section_5']}>
                        <div className={styles['wrapper']}>
                            <div className={styles['text']}>
                                <h3>All your links at one place</h3>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur
                                    adipisicing elit. Quae accusantium rerum
                                    mollitia dicta nesciunt nihil neque nostrum
                                    perspiciatis voluptates dolorum, suscipit
                                    eum nobis fugiat aspernatur maiores? Esse
                                    vero odit dicta?
                                </p>
                            </div>
                            <div className={`${styles.ss3} ${styles.image}`}>
                                <img src="./ss3.png" alt="home page" />
                            </div>
                        </div>
                    </div>
                </section>
                
            </main>
        </>
    );
}

export default LandingView;
