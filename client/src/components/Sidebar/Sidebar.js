import React from "react";
import "./Sidebar.css";
import { SidebarNavigationOptions } from "../../Constants";

export const Sidebar = ({ homepageContent, updateHomepageContent }) => {
  return (
    <div className="sidebar">
      {Object.keys(SidebarNavigationOptions)?.map((key) => (
        <p
          onClick={() => {
            updateHomepageContent(key);
          }}
          key={key}
          className={`sidebar-key ${
            key === homepageContent ? "sidebar-key-active" : "sidebar-inactive"
          }`}
        >
          {key}
        </p>
      ))}
    </div>
  );
};
