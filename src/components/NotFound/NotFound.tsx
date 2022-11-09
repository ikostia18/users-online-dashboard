import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate('/');
    }, 2000);
  });

  const style: React.CSSProperties = {
    fontSize: 18,
  };

  return (
    <div className="page-not-found-wrapper">
      <div className="page-not-found-title" style={style}>
        Page Not Found
      </div>
      <p>Redirecting to home page...</p>
    </div>
  );
}

export default NotFound;
