import React from "react";
import { Outlet } from "react-router-dom";
import { SideBar } from "../../components/sidebar/SidebarComponent";
import { ExportComponent } from "../../components/export/ExportComponent";

const Export = () => {
  return (
    <div className="content">
      <ExportComponent />
    </div>
  );
};

export const ExportPage = () => {
  return (
    <>
      <Outlet />
      <div style={{ display: "flex" }}>
        <SideBar />
        <Export />
      </div>
    </>
  );
};

export default ExportPage;

