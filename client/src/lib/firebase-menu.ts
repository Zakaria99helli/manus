import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, off } from 'firebase/database';
import { firebaseConfig } from './firebase-config';

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

export function setMenuToFirebase(menu: any) {
  return set(ref(db, 'menu'), menu);
}

export function subscribeMenuFromFirebase(cb: (menu: any) => void) {
  const menuRef = ref(db, 'menu');
  const handler = (snap: any) => cb(snap.val() || []);
  onValue(menuRef, handler);
  return () => off(menuRef, 'value', handler);
}
