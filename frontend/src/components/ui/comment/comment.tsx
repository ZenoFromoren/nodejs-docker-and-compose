import { FC } from 'react';
import { TComment } from '../../../utils/types';
import styles from './comment.module.css';
import { MapPin } from '../map-pin/map-pin';
import defaultAvatar from '../../../images/defaultAvatar.svg';

type TCommentProps = {
  commentData: TComment;
};

export const Comment: FC<TCommentProps> = ({ commentData }) => {
  const { text, owner, createdAt } = commentData;

  return (
    <article className={styles.comment}>
      <div className={styles.ownerData}>
        <img src={defaultAvatar} alt='Аватар автора' className={styles.avatar} />
        <div className={styles.ownerInfo}>
          <p className={styles.userName}>{owner.username}</p>
          <div className={styles.cityBlock}>
            <MapPin className={styles.mapPin}/>
            <p className={styles.city}>{owner.city}</p>
          </div>
        </div>
        <p className={styles.date}>{`${new Date(createdAt).toLocaleDateString()} ${new Date(createdAt).toLocaleTimeString()}`}</p>
      </div>
      <p className={styles.text}>{text}</p>
    </article>
  );
};
