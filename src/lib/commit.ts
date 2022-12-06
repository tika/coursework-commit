import { User } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  FieldValue,
  Firestore,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { FirebaseStorage, ref, uploadBytesResumable } from "firebase/storage";

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
export async function createComponent(
  data: createComponentData,
  user: User,
  firestore: Firestore,
  storage: FirebaseStorage
) {
  const { images, ...meta } = data;

  const ref = addDoc(
    collection(firestore, `courseworks/${user.uid}/components`),
    { createdAt: serverTimestamp(), lastUpdated: serverTimestamp(), ...meta }
  );

  // upload images
  const files = await Promise.all(
    images.map((img) => uploadImg(img, user, storage))
  );

  console.log(files);

  return ref;
}

async function uploadImg(img: File, user: User, storage: FirebaseStorage) {
  const storageRef = ref(storage, `courseworks/${user.uid}/${img.name}`);

  const docRef = await uploadBytesResumable(storageRef, img);

  return Promise.resolve(docRef.metadata.fullPath);
}

// update component
export async function updateComponent(
  componentId: string,
  data: Partial<createComponentData>,
  user: User,
  firestore: Firestore,
  storage: FirebaseStorage
) {
  const { images, ...meta } = data;

  const ref = updateDoc(
    doc(firestore, `courseworks/${user.uid}/components/${componentId}`),
    { lastUpdated: serverTimestamp(), ...meta }
  );

  // todo: upload images

  return ref;
}

// delete component
export async function deleteComponent(
  componentId: string,
  user: User,
  firestore: Firestore
) {
  const componentDoc = doc(
    firestore,
    `courseworks/${user.uid}/components/${componentId}`
  );

  // delete doc
  deleteDoc(componentDoc);

  return { success: true };
}
