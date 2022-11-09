import { collection } from 'firebase/firestore';
import { db } from './firebase-init';

export const USERS_COLLECTION = 'users';

export const usersCollectionRef = collection(db, USERS_COLLECTION);
