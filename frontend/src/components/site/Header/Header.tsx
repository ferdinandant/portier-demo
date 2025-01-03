import React from "react";
import classNames from "classnames";

import {
  ROUTE_GROUPS_LIST,
  ROUTE_KEYCHAINS_LIST,
  ROUTE_LOCKS_LIST,
  ROUTE_STAFFS_LIST,
} from "../../../constants/routes";

export default function Header() {
  const links = [
    { name: "Keychains", href: ROUTE_KEYCHAINS_LIST, isActive: true },
    { name: "Groups", href: ROUTE_GROUPS_LIST, isActive: false },
    { name: "Locks", href: ROUTE_LOCKS_LIST, isActive: false },
    { name: "Staffs", href: ROUTE_STAFFS_LIST, isActive: false },
  ];

  return (
    <nav className="fixed w-full bg-slate-900 h-14 flex items-stretch px-2 shadow-lg gap-1 border-b-4 border-red-600">
      {links.map((item, index) => {
        const { name, href, isActive } = item;
        return (
          <a
            href={href}
            key={index}
            className={classNames(
              "font-semibold text-slate-100 px-4 flex items-center transition-all hover:bg-slate-800",
              isActive && "bg-slate-800"
            )}
          >
            {name}
          </a>
        );
      })}
    </nav>
  );
}
