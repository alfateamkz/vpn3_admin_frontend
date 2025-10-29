import { Outlet } from "react-router-dom";
import { SideBar } from "../../components/sidebar/SidebarComponent";
import PayoutsComponent from "../../components/payouts/PayoutsComponent";

export const PayoutsPage = () => {
  return (
    <>
      <Outlet />
      <div style={{ display: "flex" }}>
        <SideBar />
        <div className="content">
          <PayoutsComponent />
        </div>
      </div>
    </>
  );
};
