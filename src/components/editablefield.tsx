import {
  Button,
  Card,
  Fieldset,
  Note,
  Spacer,
  Tabs,
  Text,
} from "@geist-ui/core";
import { Eye, PenTool } from "@geist-ui/icons";
import { User } from "firebase/auth";
import { DocumentData, Firestore } from "firebase/firestore";
import { FirebaseStorage } from "firebase/storage";
import React, { useEffect, useState } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
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
  function onChange(evt: ContentEditableEvent) {
    const newVal = evt.target.value;

    // call set state
    props.state[1](newVal);
  }

  return (
    <ContentEditable
      html={props.state[0]}
      onBlur={(evt) => props.onFinish && props.onFinish(evt.target.innerHTML)}
      onChange={(evt) => onChange(evt)}
      tagName="pre"
      className={props.className + " " + editablefieldStyles.component}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          document.execCommand("insertLineBreak");
          event.preventDefault();
        }
      }}
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

// markdown view
export function EditableFieldMarkdownFirebase(props: {
  componentId: string;
  tagName: "h1" | "h2" | "h3" | "span" | "p";
  user: User;
  firestore: Firestore;
  componentData: DocumentData;
  storage: FirebaseStorage;
  dataKey: string;
}) {
  const [text, setText] = useState("");
  const [previewMode, setPreviewMode] = useState(false);

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
  function nl2br(str: string, is_xhtml?: boolean) {
    var breakTag =
      is_xhtml || typeof is_xhtml === "undefined" ? "<br />" : "<br>";
    return (str + "")
      .replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, "$1" + breakTag + "$2")
      .replaceAll("<br />", "\n");
  }

  return (
    <div>
      <Tabs initialValue="1">
        <Tabs.Item label="preview" value="1">
          <Card>
            <ReactMarkdown className={editablefieldStyles.md}>
              {nl2br(text)}
            </ReactMarkdown>
          </Card>
        </Tabs.Item>
        <Tabs.Item label="edit" value="2">
          {props.tagName === "p" ? (
            <EditableArea state={[text, setText]} onFinish={submit} />
          ) : (
            <EditableInline
              tagName={props.tagName}
              state={[text, setText]}
              onFinish={submit}
            />
          )}
        </Tabs.Item>
      </Tabs>
    </div>
  );
}
