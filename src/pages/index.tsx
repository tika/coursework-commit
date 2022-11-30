import { Link, Code, Page } from "@geist-ui/core";
import styles from "../styles/Landing.module.css";
import { useSignInWithGithub } from "react-firebase-hooks/auth";

export default function Landing() {
  const [signInWithGithub, user, loading, error] = useSignInWithGithub(auth);

  

  return (
    <Page className={styles.container}>
      <Code>coursework-commit</Code>
      <h2>Your coursework solution</h2>
      <Link href="login" icon color>
        Login with GitHub
      </Link>
    </Page>
  );
}
