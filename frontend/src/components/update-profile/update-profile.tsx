import { FC, SyntheticEvent, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { userSelectors } from '../../services/slices/userSlice';
import { getUser, updateUser } from '../../services/thunks/userThunks';
import { UpdateProfileUI } from '../ui/update-profile/update-profile';
import { useNavigate } from 'react-router-dom';
import { defaultAbout } from '../../utils/constants';

export const UpdateProfile: FC = () => {
  const userData = useSelector(userSelectors.selectUserData);

  const user = {
    username: userData?.username!,
    city: userData?.city!,
    about: userData?.about!,
  };

  const [username, setUserName] = useState(user.username);
  const [city, setCity] = useState(user.city);
  const [about, setAbout] = useState<string | null>(user.about);

  const userNameError = !!username && username.length < 2;

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(updateUser({ username, city, about: `${about?.length ? about : defaultAbout}` }));
    dispatch(getUser());
    navigate(-1);
  };

  return (
    <UpdateProfileUI
      username={username}
      setUserName={setUserName}
      userNameError={userNameError}
      city={city}
      setCity={setCity}
      about={about!}
      setAbout={setAbout}
      handleSubmit={handleSubmit}
    />
  );
};
