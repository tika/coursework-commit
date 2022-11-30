import { User } from "firebase/auth";
import { addDoc, collection, doc, Firestore, setDoc } from "firebase/firestore";
import {
  StorageReference,
  UploadMetadata,
  UploadResult,
  UploadTask,
} from "firebase/storage";

import { app } from "./firebase";

type SubmittedCommitData = {
  overview: string;
  message: string;
  images: File[];
  date: Date;
};

export async function commit(
  data: SubmittedCommitData,
  user: User,
  firestore: Firestore,
  uploadFiles: (
    storageRef: StorageReference,
    data: Blob | Uint8Array | ArrayBuffer,
    metadata?: UploadMetadata | undefined
  ) => Promise<UploadResult | undefined>
) {
  // 1. upload to collection
  const coursework = await setDoc(doc(firestore, `courseworks/${user.uid}`), {
    title: "Computing coursework",
    started: Date(),
  });

  const courseworks = collection(firestore, `courseworks/${user.uid}/commits`);

  const t = await addDoc(courseworks, {
    message: data.message,
    overview: data.overview,
  });
}
