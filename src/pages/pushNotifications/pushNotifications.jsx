import React from "react";
import { Outlet } from "react-router-dom";
import { SideBar } from "../../components/sidebar/SidebarComponent";
import { PushNotificationsComponent } from "../../components/pushNotifications/PushNotificationsComponent";

export const PushNotificationsPage = () => {
  return (
    <>
      <Outlet />
      <div style={{ display: "flex" }}>
        <SideBar />
        <div className="content">
          <PushNotificationsComponent />
        </div>
      </div>
    </>
  );
};
