import { Loading, Page } from "@geist-ui/core";
import { useAuthState, useSignInWithGithub } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { app } from "../../lib/firebase";
import { useRouter } from "next/router";
import { useEffect } from "react";

const auth = getAuth(app);

export default function Landing() {
  const router = useRouter();
  const [user, userLoading, userError] = useAuthState(auth);
  const [signInWithGithub, gUser, loading, error] = useSignInWithGithub(auth);

  // Redirect user if not logged in
  useEffect(() => {
    if (!user && !userLoading) {
      router.push("/");
    }
  }, [user, router, userLoading]);

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
        </Page>
      )}
    </>
  );
}
