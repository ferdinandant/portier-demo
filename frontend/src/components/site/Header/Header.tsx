import React from "react";
import classNames from "classnames";

import {
  ROUTE_GROUPS_LIST,
  ROUTE_KEYCHAINS_LIST,
  ROUTE_LOCKS_LIST,
  ROUTE_STAFFS_LIST,
} from "../../../constants/routes";

const links = [
  { name: "Keychains", href: ROUTE_KEYCHAINS_LIST, prefix: "/keychains" },
  { name: "Staffs", href: ROUTE_STAFFS_LIST, prefix: "/staffs" },
];

export default function Header() {
  return (
    <nav className="fixed w-full bg-slate-900 h-14 flex items-stretch px-4 shadow-lg border-b-4 border-red-600">
      {links.map((item, index) => {
        const { name, href } = item;
        const isActive = false;
        return (
          <a
            href={href}
            key={index}
            className={classNames(
              "font-semibold text-slate-100 px-4 flex items-center transition-all hover:bg-slate-800",
              isActive && "bg-red-800 hover:bg-red-800"
            )}
          >
            {name}
          </a>
        );
      })}
    </nav>
  );
}
