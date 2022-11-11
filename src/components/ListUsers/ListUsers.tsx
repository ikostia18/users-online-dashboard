import { useState, useEffect } from 'react';
import { DocumentData, getDocs, onSnapshot } from 'firebase/firestore';
import { usersCollectionRef } from '../../lib/firestore.collections';
import './style.css';
import { useLocation } from 'react-router-dom';

export default function ListUsers() {
  const [users, setUsers] = useState<{ data: DocumentData; id: string }[]>();
  const [isRealTime, setIsRealTime] = useState(true);

  const { state } = useLocation();

  useEffect(() => {
    getUsers();
  }, []);

  // Update users collection data every 3 sec
  useEffect(() => {
    if (!isRealTime) {
      let interval: NodeJS.Timer;
      if (users) {
        interval = setInterval(getUsers, 3000);
      }
      return () => clearInterval(interval);
    }
  }, [users]);

  // Realtime listener to users collection updates
  useEffect(() => {
    if (isRealTime) {
      const unsubscribe = onSnapshot(usersCollectionRef, (snapshot) => {
        setUsers(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        );
      });
      return () => {
        unsubscribe();
      };
    }
  }, [users]);

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

  const onOptionChange = (e: React.ChangeEvent<HTMLElement>) => {
    e.preventDefault();
    const updateType = (e.target as HTMLInputElement).value;
    setIsRealTime(updateType === 'Realtime' ? true : false);
  };

  const handleUserClick = () => {};

  return (
    <div className="dashbard-wrapper">
      <div className="welcome-main-header top-space">Live users Dashboard</div>
      <div className="welcome-user top-space">
        Hello and welcome {state.name}, {state.email}
      </div>

      <div className="top-space">
        You can choose a realtime listener to users collection updates or every
        3 seconds:
      </div>

      <div className="radio-button-group">
        <input
          type="radio"
          checked={isRealTime === true}
          value="Realtime"
          name="userUpdates"
          onChange={onOptionChange}
        />
        Realtime
        <input
          type="radio"
          checked={isRealTime === false}
          value="Seconds"
          name="userUpdates"
          onChange={onOptionChange}
        />
        Every 3 sec
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
