import {
  Button,
  Card,
  Dot,
  Input,
  Loading,
  Page,
  Text,
  useInput,
} from "@geist-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { app } from "../../lib/firebase";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { collection, doc, getFirestore } from "firebase/firestore";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import appStyles from "../../styles/App.module.css";
import { daysUntil } from "../../lib/dateutils";
import { createCourseworkSection, deleteComponent } from "../../lib/commit";
import { getStorage } from "firebase/storage";
import { Trash2 } from "@geist-ui/icons";

const auth = getAuth(app);
const firestore = getFirestore();
const storage = getStorage();

export default function App() {
  const router = useRouter();
  const [user, userLoading, userError] = useAuthState(auth);
  const title = useInput("");
  const due = useInput("");
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const [courseworkData, courseworkLoading, error] = useDocument(
    doc(getFirestore(app), `courseworks/${user?.uid}`),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const [componentsData, componentsLoading, componentsError] = useCollection(
    collection(getFirestore(app), `courseworks/${user?.uid}/components`)
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

  if (componentsError) {
    return (
      <Page>
        <Dot type="error" />
        {componentsError.name}: {componentsError.message}
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

    // no user
    if (!user) {
      return;
    }

    // Create document
    createCourseworkSection(
      { title: title.state, due: new Date(due.state) },
      user,
      firestore
    );
  }

  return (
    <>
      {userLoading || !user || courseworkLoading || !componentsData ? (
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
              <div>
                <Text h3>Your components</Text>
                <div className={appStyles.components}>
                  {componentsData.docs.map((doc, i) => (
                    <Card
                      key={doc.id}
                      hoverable
                      onClick={(evt) => {
                        if (evt.shiftKey) {
                          // delete component
                          deleteComponent(doc.id, user, firestore);
                        } else {
                          router.push(`/@app/${doc.id}`);
                        }
                      }}
                      onMouseEnter={() => setHoveredCard(i)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <div>
                        <Text h3>{doc.data().title}</Text>
                        <Text>{doc.data().description}</Text>
                      </div>
                    </Card>
                  ))}
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
