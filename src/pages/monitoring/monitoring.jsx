import { Outlet } from "react-router-dom";
import { SideBar } from "../../components/sidebar/SidebarComponent";
import MonitoringComponent from "../../components/monitoring/MonitoringComponent";

const Monitoring = () => {
  return (
    <div className="content">
      <MonitoringComponent />
    </div>
  );
};

export const MonitoringPage = () => {
  return (
    <>
      <Outlet />
      <div style={{ display: "flex" }}>
        <SideBar />
        <Monitoring />
      </div>
    </>
  );
};
