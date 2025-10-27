import React from "react";
import { Outlet } from "react-router-dom";
import { SideBar } from "../../components/sidebar/SidebarComponent";
import { IPWhitelistComponent } from "../../components/ipWhitelist/IPWhitelistComponent";

export const IPWhitelistPage = () => {
  return (
    <>
      <Outlet />
      <div style={{ display: "flex" }}>
        <SideBar />
        <div className="content">
          <IPWhitelistComponent />
        </div>
      </div>
    </>
  );
};

