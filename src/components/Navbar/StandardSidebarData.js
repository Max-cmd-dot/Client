import React from "react";
import * as AiIcons from "react-icons/ai";
import * as bifrom from "react-icons/bi";
import * as feathericons from "react-icons/fi";

export const StandardSidebarData = [
  {
    title: "Landing",
    path: "/landing",
    icon: <bifrom.BiLaptop />,
    cName: "nav-text",
  },
  {
    title: "Profile",
    path: "/profile",
    icon: <feathericons.FiUser />,
    cName: "nav-text",
  },
  {
    title: "Logout",
    path: "/logout",
    icon: <feathericons.FiLogOut />,
    cName: "nav-text",
  },
];
