import { Button, Dot, Loading, Page } from "@geist-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { app } from "../../lib/firebase";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { useUploadFile } from "react-firebase-hooks/storage";
import { commit } from "../../lib/commit";

const auth = getAuth(app);
const firestore = getFirestore();
const storage = getStorage(app);

export default function App() {
  const router = useRouter();
  const [user, userLoading, userError] = useAuthState(auth);
  const [uploadFile, uploading, snapshot, error] = useUploadFile();

  // Redirect user if not logged in
  useEffect(() => {
    if (!user && !userLoading) {
      router.push("/");
    }
  }, [user, router, userLoading]);

  if (userError) {
    return (
      <Page>
        <Dot type="error" />
        {userError.name}: {userError.message}
      </Page>
    );
  }

  return (
    <>
      {userLoading || !user ? (
        <Page>
          <Loading>Loading user info</Loading>
        </Page>
      ) : (
        <Page>
          <h1>Hi, {user.displayName}!</h1>
          <h2>Your most recent commit was on</h2>
          <Button
            onClick={() =>
              commit(
                {
                  date: new Date(),
                  images: [],
                  message: "hello world",
                  overview: "test document",
                },
                user,
                firestore,
                uploadFile
              )
            }
          >
            Add doc
          </Button>
        </Page>
      )}
    </>
  );
}
