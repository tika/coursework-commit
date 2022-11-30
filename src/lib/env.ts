import { str, envsafe, port, url } from "envsafe";

export const env = envsafe({
  NODE_ENV: str({
    devDefault: "development",
    choices: ["development", "test", "production"],
  }),
  PORT: port({
    devDefault: 3000,
    desc: "The port the app is running on",
    example: 80,
  }),
  NEXT_PUBLIC_API_KEY: str({
    desc: "Firebase API Key",
  }),
  NEXT_PUBLIC_AUTH_DOMAIN: str({
    desc: "Firebase auth domain",
  }),
  NEXT_PUBLIC_PROJECT_ID: str({
    desc: "Firebase Project Id",
  }),
  NEXT_PUBLIC_STORAGE_BUCKET: str({
    desc: "Firebase Storage Bucket",
  }),
  NEXT_PUBLIC_MESSAGING_SENDER_ID: str({
    desc: "Firebase Messaging Sender Id",
  }),
  NEXT_PUBLIC_APP_ID: str({
    desc: "Firebase App Id",
  }),
});
