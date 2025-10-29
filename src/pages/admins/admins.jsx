import React from "react";
import { Outlet } from "react-router-dom";
import { SideBar } from "../../components/sidebar/SidebarComponent";
import { AdminsComponent } from "../../components/admins/AdminsComponent";

const Admins = () => {
  return (
    <div className="content">
      <AdminsComponent />
    </div>
  );
};

export const AdminsPage = () => {
  return (
    <>
      <Outlet />
      <div style={{ display: "flex" }}>
        <SideBar />
        <Admins />
      </div>
    </>
  );
};

export default AdminsPage;

