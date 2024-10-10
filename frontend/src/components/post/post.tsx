import { FC, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { useParams } from 'react-router-dom';
import { fetchPostById } from '../../services/thunks/postsThunks';
import { useDispatch, useSelector } from '../../services/store';
import { postsSelectors } from '../../services/slices/postsSlice';
import { userSelectors } from '../../services/slices/userSlice';
import styles from './post.module.css';
import { LeaveACommentButton } from '../ui/leave-a-comment-button/leave-a-comment-button';
import { Link } from 'react-router-dom';
import { leaveAComment } from '../../services/thunks/userThunks';
import { TComment } from '../../utils/types';
import { Comment } from '../ui/comment/comment';
import { PostSkeleton } from './post-skeleton';

export const Post: FC = () => {
  const params = useParams();
  const postId = Number(params.postId);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPostById(postId));
  }, [leaveAComment]);

  const post = useSelector(postsSelectors.selectCurrentPost);
  let comments = post?.comments;

  if (comments) {
    comments = [...comments!].reverse();
  }

  const isAuth = useSelector(userSelectors.selsectIsAuthenticated);
  const userId = useSelector(userSelectors.selectUserData)!?.id;

  const [commentText, setCommentText] = useState('');

  const textarea = document.querySelector<HTMLTextAreaElement>('textarea');

  const minHeight = 20;
  const maxHeight = 260;

  const constrain = (n: number, low: number, high: number) => {
    return Math.max(Math.min(n, high), low);
  };

  if (textarea !== null) {
    textarea.addEventListener('input', () => {
      textarea.style.setProperty('height', '0');
      textarea.style.setProperty(
        'height',
        constrain(textarea.scrollHeight, minHeight, maxHeight) + 'px'
      );
    });
  }

  const postBody = post?.text!;

  const htmlText = `
    <body>
      ${postBody}
    </body>
  `;

  const sanitizedHtml = DOMPurify.sanitize(htmlText);

  const handleLeaveAComment = () => {
    dispatch(leaveAComment({ text: commentText, userId, postId }));
    dispatch(fetchPostById(postId));
    setCommentText('');
  };

  if (!post) {
    return <PostSkeleton />;
  }

  return (
    <main className={styles.main}>
      {post ? (
        <div className={styles.content}>
          <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }}></div>
          <div className={styles.comments}>
            {isAuth ? (
              <div className={styles.textareaBlock}>
                <textarea
                  placeholder='Написать комментарий'
                  className={styles.textarea}
                  onChange={(e) => setCommentText(e.target.value)}
                  value={commentText}
                />
                <LeaveACommentButton
                  className={styles.leaveACommentButton}
                  onClick={handleLeaveAComment}
                />
              </div>
            ) : (
              <div className={styles.authBlock}>
                <p className={styles.authBlock__text}>
                  Оставлять комментарии могут только авторизованные пользователи
                </p>
                <div className={styles.authBlock__buttons}>
                  <Link to='/login'>
                    <button type='button' className={styles.loginButton}>
                      Войти
                    </button>
                  </Link>
                  <Link to='/register'>
                    <button type='button' className={styles.registerButton}>
                      Зарегистрироваться
                    </button>
                  </Link>
                </div>
              </div>
            )}
            {comments!.length ? (
              <>
                <h3 className={styles.comments__title}>
                  Комментарии: {comments!.length}
                </h3>
                <section className={styles.comments__block}>
                  {comments?.map((commentData: TComment) => {
                    return (
                      <Comment commentData={commentData} key={commentData.id} />
                    );
                  })}
                </section>
              </>
            ) : (
              <p className={styles.comments__title}>Нет комментариев</p>
            )}
          </div>
        </div>
      ) : (
        <PostSkeleton />
      )}
    </main>
  );
};
