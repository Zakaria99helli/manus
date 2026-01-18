import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push } from 'firebase/database';
import { firebaseConfig } from './firebase-config';

let db: any = null;

try {
  const app = initializeApp(firebaseConfig);
  db = getDatabase(app);
} catch (error) {
  console.error('Firebase initialization failed:', error);
}

export function pushOrderToFirebase(order: any) {
  if (!db) {
    console.warn('Firebase DB not initialized, skipping push');
    return Promise.resolve();
  }
  // Push order to /orders in realtime DB
  return push(ref(db, 'orders'), order);
}
