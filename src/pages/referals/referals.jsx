import { Outlet } from "react-router-dom";

import { apiRequests } from "../../shared/api/apiRequests";

import { SideBar } from "../../components/sidebar/SidebarComponent";
import { ReferalsComponent } from "../../components/referals/ReferalsComponent";

export const ReferalsPage = () => {
  const getReferals = async (page, limit, user_id) => {
    try {
      const response = await apiRequests.referals.list(page, limit, user_id || null);
      return response.data;
    } catch (e) {
      const detail = e.response?.data?.detail;
      if (e.response?.status === 400) {
        alert(detail);
      } else console.log(detail);
      throw e;
    }
  };

  const getStats = async (user_id) => {
    try {
      const response = await apiRequests.referals.stats(user_id || null);
      return response.data;
    } catch (e) {
      const detail = e.response?.data?.detail;
      if (e.response?.status === 400) {
        alert(detail);
      } else console.log(detail);
      return null;
    }
  };

  return (
    <>
      <Outlet />
      <div style={{ display: "flex" }}>
        <SideBar />
        <div className="content">
          <ReferalsComponent getReferals={getReferals} getStats={getStats} />
        </div>
      </div>
    </>
  );
};
