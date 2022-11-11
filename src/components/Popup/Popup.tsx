import { DocumentData } from 'firebase/firestore';
import './style.css';

interface IPopup {
  data: DocumentData;
  closePopup: any;
}

const Popup = (props: IPopup) => {
  return (
    <div className="popup-container">
      <div className="popup-body">
        <div className="popup-row">Name: {props.data.name}</div>
        <div className="popup-row">Email: {props.data.email}</div>
        <div className="popup-row">User Agent: {props.data.userAgent}</div>
        <div className="popup-row">
          Entrance Time: {props.data.entranceTime.toDate().toTimeString()}
        </div>
        <div className="popup-row">visits Count: {props.data.visitsCount}</div>
        <button className='close-button' onClick={props.closePopup}>Close</button>
      </div>
    </div>
  );
};

export default Popup;
