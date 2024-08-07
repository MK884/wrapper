
import style from '../styles/create-new/createNew.module.scss';
import Container from '../ui/Container';
import { FaLink } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CreatNew = () => {
  const navigate = useNavigate();
    return (
        <div className={style['main']}>
          <h1>Create New Project</h1>
            <Container
                className={style['project']}
                onClick={() => navigate('/create-sl')}
            >
                <div className={style['info']}>
                    <h4>Short Link</h4>
                    <p>Short your link</p>
                </div>
                <div className={style['icon']}>
                    <FaLink />
                </div>
            </Container>
        </div>
    );
};

export default CreatNew;
