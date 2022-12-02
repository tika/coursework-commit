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
import { FormEvent, useEffect } from "react";
import { getStorage } from "firebase/storage";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { useUploadFile } from "react-firebase-hooks/storage";
import { useDocument } from "react-firebase-hooks/firestore";
import appStyles from "../../styles/App.module.css";
import { daysUntil } from "../../lib/dateutils";
import ReactMarkdown from "react-markdown";

const auth = getAuth(app);
const firestore = getFirestore();
const storage = getStorage(app);

export default function App() {
  const router = useRouter();
  const [user, userLoading, userError] = useAuthState(auth);
  const [uploadFile, uploading, snapshot, fileError] = useUploadFile();
  const title = useInput("");
  const due = useInput("");
  const md = useInput("");

  const [courseworkData, courseworkLoading, error] = useDocument(
    doc(getFirestore(app), `courseworks/${user?.uid}`),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

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

  function createCoursework(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!courseworkData) {
      return;
    }

    if (title.state === "" || due.state === "") {
      return;
    }

    // already created
    if (courseworkData.exists()) {
      return;
    }

    // Create document
    const courseworkRef = doc(firestore, `courseworks/${user?.uid}`);

    // set data
    setDoc(courseworkRef, {
      title: title.state,
      due: new Date(due.state),
      createdAt: new Date(),
    });
  }

  return (
    <>
      {userLoading || !user || courseworkLoading ? (
        <Page>
          <Loading>Loading user info</Loading>
        </Page>
      ) : (
        <Page>
          <h1>Hi, {user.displayName}!</h1>
          {courseworkData && courseworkData.exists() ? (
            <div>
              <Text>
                Title: <Text b>{courseworkData.data().title}</Text>
              </Text>
              <Text>
                Is due in:{" "}
                <Text b>
                  {daysUntil(courseworkData.data().due.toDate())} days
                </Text>
              </Text>
              <Text>
                Started at:{" "}
                <Text b>
                  {courseworkData.data().createdAt.toDate().toLocaleString()}
                </Text>
              </Text>
              <div className={appStyles.layout}>
                <div>
                  <Textarea height="15em" width="100%" {...md.bindings} />
                </div>
                <div className={appStyles.md}>
                  <ReactMarkdown>{md.state}</ReactMarkdown>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <Text>You haven&apos;t yet created your coursework</Text>
              <form className={appStyles.form} onSubmit={createCoursework}>
                <Input
                  placeholder="e.g. OSCAR Radio"
                  width="100%"
                  {...title.bindings}
                >
                  <Text>Title</Text>
                </Input>
                <Input
                  placeholder="No Date Selected"
                  htmlType="date"
                  width="100%"
                  {...due.bindings}
                >
                  <Text>Due Date</Text>
                </Input>
                <br />
                <br />
                <Button type="secondary" htmlType="submit">
                  Start Coursework
                </Button>
              </form>
            </div>
          )}
        </Page>
      )}
    </>
  );
}
