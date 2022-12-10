import {
  Button,
  Dot,
  Input,
  Link,
  Loading,
  Page,
  Spacer,
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
import {
  EditableFieldFirebase,
  EditableFieldMarkdownFirebase,
} from "../../components/editablefield";
import { formatDate } from "../../lib/dateutils";
import { ArrowLeft } from "@geist-ui/icons";

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
          <Link
            href="/@app"
            color
            style={{ display: "flex", alignItems: "center" }}
          >
            <ArrowLeft scale={0.5} />
            Go back
          </Link>
          <Spacer height={1} />
          <EditableFieldFirebase
            componentData={componentData}
            dataKey="title"
            componentId={componentId as string}
            firestore={firestore}
            storage={storage}
            user={user}
            tagName="h1"
          />
          <EditableFieldFirebase
            componentData={componentData}
            dataKey="description"
            componentId={componentId as string}
            firestore={firestore}
            storage={storage}
            user={user}
            tagName="h3"
          />
          <span>
            Last edited {formatDate(componentData.data().lastUpdated)} ago
          </span>
          <Spacer height={1} />
          <EditableFieldMarkdownFirebase
            componentData={componentData}
            dataKey="content"
            componentId={componentId as string}
            firestore={firestore}
            storage={storage}
            user={user}
            tagName="p"
          />
        </Page>
      )}
    </>
  );
}
