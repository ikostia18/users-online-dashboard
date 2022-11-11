import { useState, useEffect } from 'react';
import { DocumentData, getDocs, onSnapshot } from 'firebase/firestore';
import { usersCollectionRef } from '../../lib/firestore.collections';
import './style.css';
import { useLocation } from 'react-router-dom';

export default function ListUsers() {
  const [users, setUsers] = useState<{ data: DocumentData; id: string }[]>();

  const { state } = useLocation();

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

  const handleUserClick = () => {};

  return (
    <div className="dashbard-wrapper">
      <div className="welcome-main-header top-space">Live users Dashboard</div>
      <div className="welcome-user top-space">
        Hello and welcome {state.name}, {state.email}
      </div>
      <div className="top-space">The following users currently are online:</div>

      <div>
        {users &&
          users?.map(
            (user) =>
              user.data.isLoggedIn && (
                <div
                  className="user-info-wrapper"
                  onClick={handleUserClick}
                  key={user.id}
                >
                  <span>
                    &nbsp;Name:&nbsp;
                    <span className="inner-info">{user.data.name}</span>
                  </span>
                  <span>
                    &nbsp;| Entrance Time:&nbsp;
                    <span className="inner-info">
                      {user.data.entranceTime.toDate().toTimeString()}
                    </span>
                  </span>
                  <span>
                    &nbsp;| User IP:&nbsp;
                    <span className="inner-info">{user.data.ip}</span>
                  </span>

                  {/* {user.data.entranceTime}
                   */}
                  {/* within the popup
            {user.data.name}
            {user.data.email}
            {user.data.userAgent}
            {user.data.entranceTime}
          {user.data.visitsCount} */}
                </div>
              )
          )}
      </div>
    </div>
  );
}
