import React from "react";
import { Outlet } from "react-router-dom";
import { SideBar } from "../../components/sidebar/SidebarComponent";
import { AdminActionsComponent } from "../../components/adminActions/AdminActionsComponent";

export const AdminActionsPage = () => {
  return (
    <>
      <Outlet />
      <div style={{ display: "flex" }}>
        <SideBar />
        <div className="content">
          <AdminActionsComponent />
        </div>
      </div>
    </>
  );
};

