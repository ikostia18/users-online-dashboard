import { useState } from 'react';
import { getDocs } from 'firebase/firestore';
import { usersCollectionRef } from '../../lib/firestore.collections';
import { useNavigate } from 'react-router-dom';
import './style.css';

export default function Login() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [IPv6, setIPv6] = useState('');
  const [isLoginFail, setIsLoginFail] = useState(false);

  const navigate = useNavigate();

  const getLocation = () => {
    const url = `https://api.geoapify.com/v1/ipinfo?&apiKey=${process.env.REACT_APP_GEOAPIFY_API_KEY}`;
    console.log(url);
    fetch(url)
      .then((response) => response.json())
      .then((result) => setIPv6(result.ip))
      .catch((error) => console.error('error', error));
  };

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
          getLocation();

          const navState = {
            name,
            email,
            IPv6,
            time: new Date(),
          };

          // update isLogin
          // update ip
          // update enter time
          // update visitCounts ++

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
