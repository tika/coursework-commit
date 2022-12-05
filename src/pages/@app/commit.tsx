import {
  Button,
  Dot,
  Input,
  Loading,
  Page,
  Text,
  Textarea,
  useInput,
} from "@geist-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { app } from "../../lib/firebase";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import commitStyles from "../../styles/Commit.module.css";
import { createComponent } from "../../lib/commit";

const auth = getAuth(app);
const firestore = getFirestore();
const storage = getStorage(app);

export default function Commit() {
  const router = useRouter();
  const [user, userLoading, userError] = useAuthState(auth);
  const title = useInput("");
  const description = useInput("");
  const content = useInput("");
  const [imgs, setImgs] = useState<File[]>([]);

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

  function commit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      return;
    }

    const newCoursework = {
      title: title.state,
      description: description.state,
      content: content.state,
      images: imgs,
    };

    createComponent(newCoursework, user, firestore, storage);
    console.log("hello");
  }

  return (
    <>
      {userLoading || !user ? (
        <Page>
          <Loading>Loading user info</Loading>
        </Page>
      ) : (
        <Page>
          <h1>Create a new commit</h1>
          <form onSubmit={commit}>
            <Input {...title.bindings}>Title</Input>
            <Input {...description.bindings}>Description</Input>
            <div className={commitStyles.content}>
              <div>
                <Textarea width="100%" height="100%" {...content.bindings}>
                  Content
                </Textarea>
              </div>
              <div>
                <ReactMarkdown className={commitStyles.md}>
                  {content.state}
                </ReactMarkdown>
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImgs(e.target.files !== null ? [e.target.files[0]] : [])
              }
            ></input>
            <Button htmlType="submit">Create</Button>
          </form>
        </Page>
      )}
    </>
  );
}
