import { useState } from 'react';
import { getDocs } from 'firebase/firestore';
import { usersCollectionRef } from '../../lib/firestore.collections';
import './style.css';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoginFail, setIsLoginFail] = useState(false);

  const navigate = useNavigate();

  const handleLogin = () => {
    getDocs(usersCollectionRef)
      .then((response) => {
        const usersRes = response.docs.map((doc) => ({
          data: doc.data(),
          id: doc.id,
        }));

        const AuthSucceed = usersRes.filter(
          (user) => user.data.name === name && user.data.email === email
        );

        if (AuthSucceed.length > 0) {
          setIsLoginFail(false);
          navigate('/list-users');
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
