import { User } from "firebase/auth";
import { addDoc, collection, doc, Firestore, setDoc } from "firebase/firestore";
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
    meta
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
