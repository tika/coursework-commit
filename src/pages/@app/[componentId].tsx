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
import {
  ChangeEvent,
  FocusEvent,
  FormEvent,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { getStorage } from "firebase/storage";
import { doc, getFirestore } from "firebase/firestore";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import commitStyles from "../../styles/Commit.module.css";
import { createComponent, updateComponent } from "../../lib/commit";
import { useDocument } from "react-firebase-hooks/firestore";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { EditableAndFirebase } from "../../components/editablefield";

const auth = getAuth(app);
const firestore = getFirestore();
const storage = getStorage(app);

export default function Component() {
  const router = useRouter();
  const { componentId } = router.query;
  const [user, userLoading, userError] = useAuthState(auth);
  const [componentData, componentLoading, componentError] = useDocument(
    doc(getFirestore(app), `courseworks/${user?.uid}/components/${componentId}`)
  );
  const [text, setText] = useState("");

  useEffect(() => {
    if (componentData && componentData.data() && componentData.exists()) {
      setText(componentData.data().title);
    }
  }, [componentData]);

  if (userError) {
    return (
      <Page>
        <Dot type="error" />
        {userError.name}: {userError.message}
      </Page>
    );
  }

  if (componentData && !componentData.exists()) {
    router.push("/@app");
    return;
  }

  const handleChange = (evt: ContentEditableEvent) => {
    setText(evt.target.value);
  };

  const handleBlur = async (e: FocusEvent) => {
    if (!user) return;

    console.log(
      await updateComponent(
        componentId as string,
        { title: e.target.innerHTML },
        user,
        firestore,
        storage
      )
    );
  };

  return (
    <>
      {userLoading ||
      !user ||
      !componentData ||
      componentLoading ||
      !componentData.data() ? (
        <Page>
          <Loading>Loading user info</Loading>
        </Page>
      ) : (
        <Page>
          <EditableAndFirebase
            componentData={componentData}
            dataKey="title"
            componentId={componentId as string}
            firestore={firestore}
            storage={storage}
            user={user}
            tagName="h1"
          />
          <EditableAndFirebase
            componentData={componentData}
            dataKey="description"
            componentId={componentId as string}
            firestore={firestore}
            storage={storage}
            user={user}
            tagName="h3"
          />
          <h2>{componentData.data().description}</h2>
        </Page>
      )}
    </>
  );
}
