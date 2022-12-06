import { User } from "firebase/auth";
import { DocumentData, Firestore } from "firebase/firestore";
import { FirebaseStorage } from "firebase/storage";
import { useEffect, useState } from "react";
import ContentEditable from "react-contenteditable";
import { updateComponent } from "../lib/commit";
import editablefieldStyles from "../styles/EditableField.module.css";

export function EditableInline(props: {
  tagName: "h1" | "h2" | "h3" | "span";
  state: [string, (value: string) => void];
  onFinish?: (value: string) => void;
  className?: string;
}) {
  return (
    <ContentEditable
      html={props.state[0]}
      onBlur={(evt) => props.onFinish && props.onFinish(evt.target.innerHTML)}
      onChange={(evt) => props.state[1](evt.target.value)}
      className={props.className + " " + editablefieldStyles.component}
      onKeyDown={(evt) => {
        if (evt.key === "Enter") {
          evt.preventDefault();
          evt.currentTarget.blur();
        }
      }}
      tagName={props.tagName}
    />
  );
}

export function EditableArea(props: {
  state: [string, (value: string) => void];
  onFinish?: (value: string) => void;
  className?: string;
}) {
  return (
    <ContentEditable
      html={props.state[0]}
      onBlur={(evt) => props.onFinish && props.onFinish(evt.target.innerHTML)}
      onChange={(evt) => props.state[1](evt.target.value)}
      tagName="p"
      className={props.className + " " + editablefieldStyles.component}
    />
  );
}

// Specifically for the component page
export function EditableFieldFirebase(props: {
  componentId: string;
  tagName: "h1" | "h2" | "h3" | "span" | "p";
  user: User;
  firestore: Firestore;
  componentData: DocumentData;
  storage: FirebaseStorage;
  dataKey: string;
}) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (props.componentData && props.componentData.exists()) {
      setText(props.componentData.data()[props.dataKey]);
    }
  }, [props.componentData, props.dataKey]);

  async function submit(raw: string) {
    // if nothing's been updated
    if (raw === text) {
      return;
    }

    const data: any = {}; // sorry folks

    data[props.dataKey] = raw;

    await updateComponent(
      props.componentId,
      data,
      props.user,
      props.firestore,
      props.storage
    );
  }

  return (
    <>
      {props.tagName === "p" ? (
        <EditableArea state={[text, setText]} onFinish={submit} />
      ) : (
        <EditableInline
          tagName={props.tagName}
          state={[text, setText]}
          onFinish={submit}
        />
      )}
    </>
  );
}
