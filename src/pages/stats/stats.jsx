import { Outlet } from "react-router-dom";

import { SideBar } from "../../components/sidebar/SidebarComponent";

export const StatsPage = (props) => {
  return (
    <>
      <Outlet />
      <div style={{ display: "flex" }}>
        <SideBar pageName="Статистика" />
        <div style={{ flex: 1, padding: "20px" }}>
          <h1>В разработке</h1>
        </div>
      </div>
    </>
  );
};
