import { useState, useEffect } from 'react';
import { DocumentData, getDocs, onSnapshot } from 'firebase/firestore';
import { usersCollectionRef } from '../../lib/firestore.collections';
import './style.css';
import { useLocation } from 'react-router-dom';

export default function ListUsers() {
  const [users, setUsers] = useState<{ data: DocumentData; id: string }[]>();

  const { state } = useLocation();

  // console.log(state); // {name: 'Bob', email: 'bob@dash.com'}

  useEffect(() => {
    getUsers();
  }, []);

  // add update every 3 sec or fetch with interval
  // useEffect(() => {
  //   const unsubscribe = onSnapshot(usersCollectionRef, (snapshot) => {
  //     setUsers(snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
  //   });

  //   return () => {
  //     unsubscribe();
  //     log out user on closing tab / browser
  //   };
  // }, [users]);

  const getUsers = () => {
    getDocs(usersCollectionRef)
      .then((response) => {
        const usersRes = response.docs.map((doc) => ({
          data: doc.data(),
          id: doc.id,
        }));
        setUsers(usersRes);
      })
      .catch((error) => console.error(error.message));
  };

  return (
    <div className="dashbard-wrapper">
      <div className="welcome-main-header">Live users Dashboard</div>
      <div className="welcome-user">
        Hello and welcome {state.name}, {state.email}
      </div>

      {/* <button onClick={() => getUsers()}>Refresh Users</button> */}
      <div>
        {users &&
          users?.map((user) => (
            <div key={user.id}>
              {user.data.name}
              {/* {user.data.entranceTime}
              {user.data.ip} */}

              {/* within the popup
              {user.data.name}
              {user.data.email}
              {user.data.userAgent}
              {user.data.entranceTime}
              {user.data.visitsCount} */}
            </div>
          ))}
      </div>
    </div>
  );
}
