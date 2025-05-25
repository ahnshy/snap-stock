// data/firestore.ts
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  setDoc,
  doc,
  deleteDoc,
  updateDoc,
  Timestamp,
  query,
  orderBy,
  //where,
} from "firebase/firestore";
//import { getServerSession } from "next-auth/next";
//import { authOptions } from "@/app/lib/auth"
import { Todo } from "@/types";

const {
  API_KEY,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
} = process.env;

let firebaseApp: FirebaseApp | null = null;
function initFirebase() {
  if (getApps().length === 0) {
    if (!API_KEY || !AUTH_DOMAIN || !PROJECT_ID || !STORAGE_BUCKET || !MESSAGING_SENDER_ID || !APP_ID) {
      console.warn(
          "[firebase] 환경변수 미설정으로 Firebase 초기화를 건너뜁니다."
      );
      return;
    }
    firebaseApp = initializeApp({
      apiKey: API_KEY,
      authDomain: AUTH_DOMAIN,
      projectId: PROJECT_ID,
      storageBucket: STORAGE_BUCKET,
      messagingSenderId: MESSAGING_SENDER_ID,
      appId: APP_ID,
    });
  }
}

// getFirestore()도 initFirebase 이후에 호출되도록 래핑
function getDB() {
  initFirebase();
  if (!firebaseApp) {
    throw new Error(
        "[firebase] 초기화되지 않아 Firestore를 가져올 수 없습니다."
    );
  }
  return getFirestore(firebaseApp);
}

// get all docs
export async function fetchTodos(): Promise<Todo[]> {
  const fetched: Todo[] = [];
  // const session = await getServerSession(authOptions);
  // if (!session?.user?.email) {
  //   console.log("session is empty.");
  //   return fetched;
  // }

  //const email = session.user.email;
  //console.log(`login email : `, email);

  const db = getDB();
  const todosRef = collection(db, "todos");
  const descQuery = query(todosRef,
                    //where("uid", "==", email),
                    orderBy("create_at", "desc"));
  const snapshot = await getDocs(descQuery);

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    fetched.push({
      //id: docSnap.id,
      id: data.id,
      title: data.title,
      is_done: data.is_done,
      create_at: data.create_at.toDate(),
      uid: data.uid,
    });
  });
  return fetched;
}

// add to do docs
export async function addTodos(todo: { code: string; title: string; uid: string }) {
  const db = getDB();
  const ts = Timestamp.fromDate(new Date());
  const newItem = {
    id: todo.code,
    title: todo.title,
    is_done: false,
    create_at: ts,
    uid: todo.uid,
  };

  //const newRef = doc(collection(db, "todos"));
  //const newRef = doc(collection(db, "todos", todo.code));
  const newRef = doc(db, "todos", todo.code);
  await setDoc(newRef, newItem);

  return { ...newItem, create_at: ts.toDate() };
}

// get to do by id
export async function getTodo(id: string) {
  if (!id) return null;
  const db = getDB();
  const docRef = doc(db, "todos", id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id: data.id,
    title: data.title,
    is_done: data.is_done,
    create_at: data.create_at.toDate(),
    uid: data.uid,
  } as Todo;
}

export async function deleteTodo(id: string) {
  const existing = await getTodo(id);
  if (!existing) return null;
  const db = getDB();
  await deleteDoc(doc(db, "todos", id));
  return existing;
}

// edit to do by id
export async function updateTodo(
    id: string,
    { title, is_done }: { title: string; is_done: boolean }
) {
  const existing = await getTodo(id);
  if (!existing) return null;
  const db = getDB();
  await updateDoc(doc(db, "todos", id), { title, is_done });
  return { ...existing, title, is_done } as Todo;
}
