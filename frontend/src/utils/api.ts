import { getCookie } from './cookie';
import {
  TAuthResponse,
  TCodeResonse,
  TComment,
  TCreateCommentData,
  TLoginData,
  TPost,
  TRegisterData,
  TUpdateData,
  TUser,
} from './types';

const URL = 'http://localhost:5174';

export const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

export const fetchPostsApi = async (): Promise<TPost[]> => {
  return await fetch(`${URL}/posts`).then((res) => checkResponse<TPost[]>(res));
};

export const fetchLastPostsApi = async (): Promise<TPost[]> => {
  return await fetch(`${URL}/posts/last`).then((res) =>
    checkResponse<TPost[]>(res)
  );
};

export const fetchPostByIdApi = async (postId: number): Promise<TPost> => {
  return await fetch(`${URL}/posts/${postId}`).then((res) =>
    checkResponse<TPost>(res)
  );
};

// export const searchPostsApi = async (query: string): Promise<TPost[]> => {
//   return await fetch(`${URL}/posts/search?query=${query}`).then((res) => res.json()).then((data) => data);
// };

export const loginUserApi = async (data: TLoginData): Promise<TAuthResponse> =>
  await fetch(`${URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(data),
  }).then((res) => {
    if (!res.ok) {
      return Promise.reject('Неверные почта или пароль');
    }
    return res.json();
  });

export const registerUserApi = async (
  data: TRegisterData
): Promise<TAuthResponse> =>
  await fetch(`${URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(data),
  })
    .then((res) =>
      res.ok ? res.json() : res.json().then((err) => Promise.reject(err))
    )
    .then((data) => data);

export const getUserApi = async (): Promise<TUser> =>
  await fetch(`${URL}/users/me`, {
    headers: {
      authorization: getCookie('accessToken'),
    } as HeadersInit,
  })
    .then((res) =>
      res.ok ? res.json() : res.json().then((err) => Promise.reject(err))
    )
    .then((data) => data);

export const updateUserApi = async (data: TUpdateData): Promise<TUser> => {
  return await fetch(`${URL}/users/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken'),
    } as HeadersInit,
    body: JSON.stringify(data),
  }).then((res) => {
    if (!res.ok) {
      res.json().then((err: Error) => Promise.reject(err));
    }
    return res.json();
  });
};

export const getCodeConfirmRegistrationApi = async (
  registerData: TRegisterData
): Promise<TCodeResonse> =>
  await fetch(`${URL}/confirm-registration`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(registerData),
  })
    .then((res) =>
      res.ok ? res.json() : res.json().then((err) => Promise.reject(err))
    )
    .then((data) => data)
    .catch((err) => Promise.reject(err));

export const getCodeForgotPasswordApi = async (): Promise<TCodeResonse> =>
  await fetch(`${URL}/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken'),
    } as HeadersInit,
  })
    .then((res) =>
      res.ok ? res.json() : res.json().then((err) => Promise.reject(err))
    )
    .then((data) => data)
    .catch((err) => Promise.reject(err));

export const leaveACommentApi = async (
  createCommentData: TCreateCommentData
): Promise<TComment> =>
  await fetch(`${URL}/comments/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken'),
    } as HeadersInit,
    body: JSON.stringify(createCommentData),
  })
    .then((res) => checkResponse<TComment>(res))
    .then((data) => data)
    .catch((err) => Promise.reject(err));
