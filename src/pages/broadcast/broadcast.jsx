import React from "react";
import { Outlet } from "react-router-dom";
import { SideBar } from "../../components/sidebar/SidebarComponent";
import { BroadcastComponent } from "../../components/broadcast/BroadcastComponent";

export const BroadcastPage = () => {
  return (
    <>
      <Outlet />
      <div style={{ display: "flex" }}>
        <SideBar />
        <div className="content">
          <BroadcastComponent />
        </div>
      </div>
    </>
  );
};

