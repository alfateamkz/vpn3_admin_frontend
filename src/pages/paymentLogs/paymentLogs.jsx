import { Outlet } from "react-router-dom";
import { SideBar } from "../../components/sidebar/SidebarComponent";
import PaymentLogsComponent from "../../components/payments/PaymentLogsComponent";

export const PaymentLogsPage = () => {
  return (
    <>
      <Outlet />
      <div style={{ display: "flex" }}>
        <SideBar />
        <div className="content">
          <PaymentLogsComponent />
        </div>
      </div>
    </>
  );
};
