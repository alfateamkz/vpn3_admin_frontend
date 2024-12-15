import { Outlet } from "react-router-dom";

import { apiRequests } from "../../shared/api/apiRequests";

import { SideBar } from "../../components/sidebar/SidebarComponent";
import { StatsTable } from "../../components/stats/StatsComponent";

export const StatsPage = () => {
  const getData = async (page, limit, type) => {
    try {
      const response = await apiRequests.stats.orders(page, limit, type);
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
          <StatsTable getData={getData} />
        </div>
      </div>
    </>
  );
};
