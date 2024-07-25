import { AvatarGrpProps, AvatarProps } from 'interface';
import style from '../styles/avatar/avatar.module.scss';

export const AvatarGroup = ({ avatars, size = 'md' }: AvatarGrpProps) => {
    let length = avatars.length - 3;
    return (
        <>
            <div className={`${style['avatar-grp']}`}>
                {avatars.slice(0, 3).map((avatar, idx) => (
                    <Avatar key={idx} {...avatar} size={size} />
                ))}
                <div
                    className={`${style['avatar-number']} ${style[`avatar-number-${size}`]}`}
                >
                    {length > 0 ? `+${length}` : '+'}
                </div>
            </div>
        </>
    );
};

const Avatar = ({
    src,
    alt = 'Image',
    size = 'md',
    styles = {},
    onClick,
    string = 'Test',
}: AvatarProps) => {
    return (
        <div
            onClick={onClick}
            className={`${style['avatar']} ${style[`avatar-${size}`]} `}
        >
            {src ? (
                <img src={src} alt={alt} style={styles} />
            ) : (
                string.toUpperCase().charAt(0)
            )}
        </div>
    );
};

export default Avatar;
