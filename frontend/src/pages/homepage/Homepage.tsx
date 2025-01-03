import React, { useEffect } from "react";
import { ROUTE_KEYCHAINS_LIST } from "../../constants/routes";

export default function Homepage() {
  useEffect(() => {
    window.location.href = ROUTE_KEYCHAINS_LIST;
  });

  return null;
}
