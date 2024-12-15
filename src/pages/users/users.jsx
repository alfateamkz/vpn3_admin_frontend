import { Outlet } from "react-router-dom";

import { apiRequests } from "../../shared/api/apiRequests";

import { SideBar } from "../../components/sidebar/SidebarComponent";
import { UsersTable } from "../../components/users/UsersComponent";

const Users = () => {
  const getData = async (page, limit, search) => {
    try {
      const response = await apiRequests.user.all(page, limit, search);
      return response.data;
    } catch (e) {
      const detail = e.response?.data?.detail;
      if (e.response?.status === 400) {
        alert(detail);
      }
      throw e;
    }
  };

  return (
    <div>
      <UsersTable getUsers={getData} />
    </div>
  );
};

export const UsersPage = () => {
  return (
    <>
      <Outlet />
      <div style={{ display: "flex" }}>
        <SideBar pageName="Подписки" />
        <Users />
      </div>
    </>
  );
};
