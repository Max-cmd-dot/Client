import React from "react";
import * as AiIcons from "react-icons/ai";
import * as bifrom from "react-icons/bi";
import * as feathericons from "react-icons/fi";

export const SidebarData = [
  {
    title: "Home",
    path: "/",
    icon: <AiIcons.AiFillHome />,
    cName: "nav-text",
  },
  {
    title: "History",
    path: "/history",
    icon: <bifrom.BiHistory />,
    cName: "nav-text",
  },
  {
    title: "Actions",
    path: "/actions",
    icon: <bifrom.BiDumbbell />,
    cName: "nav-text",
  },
  {
    title: "Notifications",
    path: "/notifications",
    icon: <bifrom.BiBell />,
    cName: "nav-text",
  },
];
