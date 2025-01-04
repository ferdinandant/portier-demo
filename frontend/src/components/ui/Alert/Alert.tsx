import React from "react";
import { Alert as ChakraAlert } from "@chakra-ui/react";

export type AlertStatus =
  | "error"
  | "info"
  | "warning"
  | "success"
  | "neutral"
  | undefined;

type Props = {
  status: AlertStatus;
  title: string | undefined | null;
  content: any;
};

export default function Alert(props: Props) {
  const { status, title, content: rawContent } = props;

  // Parse content
  let content = rawContent;
  if (Array.isArray(content)) {
    content = (
      <div style={{ paddingLeft: 16 }}>
        {(rawContent as any[]).map((item, idx) => {
          return (
            <div style={{ display: "list-item" }} key={idx}>
              {item}
            </div>
          );
        })}
      </div>
    );
  }

  // Render
  return (
    <ChakraAlert.Root
      status={status}
      style={{ flexDirection: "column", gap: 2 }}
    >
      {/* Title */}
      {title && (
        <ChakraAlert.Title style={{ display: "flex" }}>
          <div style={{ width: 28 }}>
            <ChakraAlert.Indicator />
          </div>
          <div>
            <b>{title}</b>
          </div>
        </ChakraAlert.Title>
      )}

      {/* Description */}
      <div style={title ? { paddingLeft: 28 } : {}}>
        <ChakraAlert.Content>{content}</ChakraAlert.Content>
      </div>
    </ChakraAlert.Root>
  );
}
