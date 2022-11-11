import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDocs, updateDoc } from 'firebase/firestore';
import { usersCollectionRef } from '../../lib/firestore.collections';
import { IUserEditableDocumentData } from '../../lib/types';
import { db } from '../../lib/firebase-init';
import './style.css';

export default function Login() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoginFail, setIsLoginFail] = useState(false);

  const navigate = useNavigate();

  const getLocation = () => {
    const url = `https://api.geoapify.com/v1/ipinfo?&apiKey=${process.env.REACT_APP_GEOAPIFY_API_KEY}`;
    return fetch(url)
      .then((response) => response.json())
      .then((result) => {
        return result;
      })
      .catch((error) => console.error('error', error));
  };

  const updateUserDocument = (
    userId: string,
    visitsCount: number,
    IPv6: string
  ) => {
    const editUser: IUserEditableDocumentData = {
      ip: IPv6,
      isLoggedIn: true,
      entranceTime: new Date(),
      visitsCount: visitsCount + 1,
    };

    const docRef = doc(db, 'users', userId);
    updateDoc(docRef, editUser)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.error('error', error));
  };

  const handleLogin = () => {
    getDocs(usersCollectionRef)
      .then(async (response) => {
        const usersRes = response.docs.map((doc) => ({
          data: doc.data(),
          id: doc.id,
        }));

        const userAuthSucceed = usersRes.filter(
          (user) =>
            user.data.name === name &&
            user.data.email.toLowerCase() === email.toLowerCase()
        );

        if (userAuthSucceed.length > 0) {
          const locationResponse = await getLocation();
          const IPv6 = locationResponse.ip;

          updateUserDocument(
            userAuthSucceed[0].id,
            userAuthSucceed[0].data.visitsCount,
            IPv6
          );

          const navState = {
            name,
            email,
            IPv6,
            time: new Date(),
          };

          setIsLoginFail(false);
          navigate('/list-users', { state: navState });
        }
        setIsLoginFail(true);
      })
      .catch((error) => {
        setIsLoginFail(true);
        console.error(error.message);
      });
  };

  const nameTypeHandle = (e: React.ChangeEvent<HTMLElement>) => {
    e.preventDefault();
    setName((e.target as HTMLInputElement).value);
  };

  const emailTypeHandle = (e: React.ChangeEvent<HTMLElement>) => {
    e.preventDefault();
    setEmail((e.target as HTMLInputElement).value);
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-header">Live users Dashboard</div>
      <input
        className="input"
        type="text"
        placeholder="Name"
        onChange={nameTypeHandle}
      />
      <input
        className="input"
        type="text"
        placeholder="Email"
        onChange={emailTypeHandle}
      />
      <button
        className="login-button"
        disabled={!(name && email)}
        onClick={handleLogin}
      >
        Login
      </button>
      {isLoginFail && <p>Login Failed</p>}
    </div>
  );
}
