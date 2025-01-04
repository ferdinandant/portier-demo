import React, { ReactNode } from "react";
import { Card, Box } from "@chakra-ui/react";
import "./style.css";

type Props = {
  href?: string;
  children: ReactNode;
};

export default function SelectableCard(props: Props) {
  const { href, children } = props;

  return (
    <a className="selectable-card" href={href} style={{ width: "100%" }}>
      <Card.Root style={{ backgroundColor: "transparent", borderRadius: 4 }}>
        <Box p={4}>{children}</Box>
      </Card.Root>
    </a>
  );
}
