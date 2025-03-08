import { collection, addDoc, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import { auth, db } from "../firebaseConfig"; 

// Function to add a new task
export async function addTask(title, dueDate) {
  const user = auth.currentUser;
  if (!user) return;

  await addDoc(collection(db, "users", user.uid, "tasks"), {
    title,
    dueDate: Timestamp.fromDate(new Date(dueDate)),
    completed: false,
  });
}

// Function to fetch tasks in real-time
export function listenToTasks(setTasks) {
  const user = auth.currentUser;
  if (!user) return;

  const q = query(
    collection(db, "users", user.uid, "tasks"),
    orderBy("dueDate")
  );

  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTasks(tasks);
  });
}