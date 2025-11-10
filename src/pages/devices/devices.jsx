import { Outlet } from "react-router-dom";

import { apiRequests } from "../../shared/api/apiRequests";

import { SideBar } from "../../components/sidebar/SidebarComponent";
import { DevicesComponent } from "../../components/devices/DevicesComponent";

export const DevicesPage = () => {
  const getDevices = async (user_id, activeOnly = true, page, limit) => {
    try {
      const response = await apiRequests.devices.list(user_id || null, activeOnly, page, limit);
      return response.data;
    } catch (e) {
      const detail = e.response?.data?.detail;
      if (e.response?.status === 400) {
        alert(detail);
      } else console.log(detail);
      throw e;
    }
  };

  return (
    <>
      <Outlet />
      <div style={{ display: "flex" }}>
        <SideBar />
        <div className="content">
          <DevicesComponent getDevices={getDevices} />
        </div>
      </div>
    </>
  );
};
