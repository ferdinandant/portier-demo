import React from "react";
import classNames from "classnames";
import { useLocation } from "react-router-dom";
import { Link } from "react-router";

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
    <nav className="fixed top-0 w-full bg-slate-900 h-14 flex items-stretch px-4 shadow-lg border-b-4 border-red-600">
      {links.map((item, index) => {
        const { name, href, pattern } = item;
        const isActive = location.pathname.match(pattern);
        return (
          <Link
            to={href}
            key={index}
            className={classNames(
              "font-semibold text-slate-100 px-4 flex items-center transition-all",
              isActive && "bg-red-800",
              !isActive && "hover:bg-slate-800"
            )}
          >
            {name}
          </Link>
        );
      })}
    </nav>
  );
}
