import { db, auth } from './firebase';
import {
  collection, doc, setDoc, deleteDoc,
  onSnapshot, query, where
} from 'firebase/firestore';
import { Client } from '../types';

// Firestore path: users/{uid}/clients/{clientId}
function clientsRef(uid: string) {
  return collection(db, 'users', uid, 'clients');
}

export function saveClient(client: Client) {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  return setDoc(doc(clientsRef(uid), client.id), client);
}

export function removeClient(clientId: string) {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  return deleteDoc(doc(clientsRef(uid), clientId));
}

// Real-time listener — calls onUpdate whenever Firestore changes
export function subscribeToClients(onUpdate: (clients: Client[]) => void) {
  const uid = auth.currentUser?.uid;
  if (!uid) return () => {};
  const q = query(clientsRef(uid));
  return onSnapshot(q, snapshot => {
    const clients = snapshot.docs.map(d => d.data() as Client);
    onUpdate(clients);
  });
}
