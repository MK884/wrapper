import style from '../styles/create-new/createNew.module.scss';
import Container from '../ui/Container';
import { FaLink } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { PiSpinnerBallDuotone } from "react-icons/pi";


const projects = [
    {
        title: 'Short Link',
        description: 'short your Link',
        path: '/create-sl',
        icon: <FaLink />,
    },
    // TODO: development
    // {
    //     title: 'Wrapper',
    //     description: 'Wrapper all your Link into one',
    //     path: '/create-wrapper',
    //     icon: <PiSpinnerBallDuotone />,
    // },
];

const CreatNew = () => {
    const navigate = useNavigate();
    return (
        <div className={style['main']}>
            <h1>Create New Project</h1>

            <div className={style['projects']}>
                {projects?.map((project) => (
                    <Container
                        className={style['project']}
                        onClick={() => navigate(project?.path)}
                    >
                        <div className={style['info']}>
                            <h4>{project.title}</h4>
                            <p>{project?.description}</p>
                        </div>
                        <div className={style['icon']}>{project?.icon}</div>
                    </Container>
                ))}
            </div>
        </div>
    );
};

export default CreatNew;
