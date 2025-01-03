import React from "react";
import classNames from "classnames";
import { useLocation } from "react-router-dom";
import { Link } from "react-router";
import "./style.css";

import {
  ROUTE_KEYCHAINS_LIST,
  ROUTE_STAFFS_LIST,
} from "../../../constants/routes";

const links = [
  {
    name: "Keychains",
    href: ROUTE_KEYCHAINS_LIST,
    pattern: /[/]keychains([/]|$)/,
  },
  {
    name: "Staffs",
    href: ROUTE_STAFFS_LIST,
    pattern: /[/]staffs([/]|$)/,
  },
];

export default function Header() {
  const location = useLocation();

  return (
    <nav className="header-nav">
      {links.map((item, index) => {
        const { name, href, pattern } = item;
        const isActive = location.pathname.match(pattern);
        return (
          <Link
            to={href}
            key={index}
            className={classNames(isActive && "active")}
          >
            {name}
          </Link>
        );
      })}
    </nav>
  );
}
