import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Popup from '../Popup/Popup';
import {
  doc,
  DocumentData,
  getDocs,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { IUserEditableDocumentData } from '../../lib/types';
import { usersCollectionRef } from '../../lib/firestore.collections';
import { db } from '../../lib/firebase-init';
import './style.css';

export default function ListUsers() {
  const [users, setUsers] = useState<{ data: DocumentData; id: string }[]>();
  const [isRealTime, setIsRealTime] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [popupData, setPopupData] = useState<DocumentData>();

  const { state } = useLocation();

  useEffect(() => {
    const updateUserDocument = (userId: string) => {
      const editUser: IUserEditableDocumentData = {
        isLoggedIn: false,
      };

      const docRef = doc(db, 'users', userId);
      updateDoc(docRef, editUser)
        .then((response) => {
          console.info(response);
        })
        .catch((error) => console.error('error', error));
    };

    getUsers();
    window.addEventListener('beforeunload', () => updateUserDocument(state.id));

    if (!isRealTime) {
      // Update users collection data every 3 sec
      let interval: NodeJS.Timer;
      if (users) {
        interval = setInterval(getUsers, 3000);
      }
      return () => {
        window.removeEventListener('beforeunload', () =>
          updateUserDocument(state.id)
        );
        clearInterval(interval);
      };
    } else {
      // Realtime listener to users collection updates
      const unsubscribe = onSnapshot(usersCollectionRef, (snapshot) => {
        setUsers(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        );
      });
      return () => {
        window.removeEventListener('beforeunload', () =>
          updateUserDocument(state.id)
        );
        unsubscribe();
      };
    }
  }, []);

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

  const handleUserClick = (data: DocumentData) => {
    setPopupData(data);
    setOpenPopup(true);
  };

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
                  onClick={() => handleUserClick(user.data)}
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
                </div>
              )
          )}
      </div>
      {openPopup && popupData ? (
        <Popup data={popupData} closePopup={() => setOpenPopup(false)} />
      ) : null}
    </div>
  );
}
