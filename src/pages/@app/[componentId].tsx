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

export default function Component() {
  const router = useRouter();
  const { componentId } = router.query;
  const [user, userLoading, userError] = useAuthState(auth);

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
          <h1>Component id = {componentId}</h1>
        </Page>
      )}
    </>
  );
}
