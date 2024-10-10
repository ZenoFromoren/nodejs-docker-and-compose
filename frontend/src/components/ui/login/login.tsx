import { FC, SyntheticEvent } from 'react';
import styles from './login.module.css';
import { Link } from 'react-router-dom';
import { ShowHidePasswordButton } from '../show-hide-password-button/show-hide-password-button';

type TLoginUIProps = {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  isPasswordShowed: boolean;
  showHidePassword: () => void;
  loginFormError: string | undefined;
  handleSubmit: (e: SyntheticEvent) => void;
};

export const LoginUI: FC<TLoginUIProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  isPasswordShowed,
  showHidePassword,
  loginFormError,
  handleSubmit,
}) => {
  return (
    <main className={styles.main}>
      <div className={styles.loginPage}>
        <h2 className={styles.title}>Вход</h2>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <div className={styles.inputBlock}>
            <input
              type='email'
              placeholder='e-mail *'
              className={styles.input}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className={styles.inputBlock}>
            <input
              type={ isPasswordShowed ? 'text' : 'password'}
              placeholder='Пароль *'
              className={styles.input}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <ShowHidePasswordButton onClick={showHidePassword} className={styles.showHidePasswordButton}/>
          </div>
          {loginFormError && <p className={styles.error}>{loginFormError}</p>}
          <button type='submit' className={styles.loginFormButton}>
            Войти
          </button>
        </form>
        <div className={styles.additionalLinks}>
          <Link to='/register'>
            <p className={styles.additionalLink}>Зарегистрироваться</p>
          </Link>
          <p className={styles.additionalLink}>Забыли пароль?</p>
        </div>
      </div>
    </main>
  );
};
