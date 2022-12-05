import { User } from "firebase/auth";
import { addDoc, collection, doc, Firestore, setDoc } from "firebase/firestore";

type createCourseworkData = {
  title: string;
  due: Date;
};

// returns a reference to the coursework document
export function createCourseworkSection(
  data: createCourseworkData,
  user: User,
  firestore: Firestore
) {
  // Create document
  const courseworkRef = doc(firestore, `courseworks/${user.uid}`);

  // set data
  setDoc(courseworkRef, {
    title: data.title,
    due: data.due,
    createdAt: new Date(),
  });

  return courseworkRef;
}

type createComponentData = {
  title: string;
  description: string;
  content: string; // .md
  images: File[];
};

// returns a reference to the component document
export function createComponent(
  data: createComponentData,
  user: User,
  firestore: Firestore
) {
  const ref = addDoc(
    collection(firestore, `courseworks/${user.uid}/components`),
    data
  );

  return ref;
}
