import { Link, Code, Page, Button, Loading, Grid } from "@geist-ui/core";
import styles from "../styles/Landing.module.css";
import { useAuthState, useSignInWithGithub } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { app } from "../lib/firebase";

const auth = getAuth(app);

export default function Landing() {
  const [user, userLoading, userError] = useAuthState(auth);
  const [signInWithGithub, gUser, loading, error] = useSignInWithGithub(auth);

  if (error) {
    return (
      <Page>
        <p>Error: {error.message}</p>
      </Page>
    );
  }

  if (loading) {
    return (
      <Page>
        <Grid.Container gap={2.5}>
          <Grid xs={24}>
            <Loading type="success">Loading</Loading>
          </Grid>
        </Grid.Container>
      </Page>
    );
  }

  return (
    <Page className={styles.container}>
      <Code>coursework-commit</Code>
      <h2>Your coursework solution</h2>

      {user ? (
        <>
          <h3>Welcome back {user.displayName}</h3>
          <Link icon href="/@app" color>
            Go to @app
          </Link>
        </>
      ) : (
        <Button onClick={() => signInWithGithub()} icon>
          Login with GitHub
        </Button>
      )}
    </Page>
  );
}
