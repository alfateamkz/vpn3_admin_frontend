import { Outlet } from "react-router-dom";

import { apiRequests } from "../../shared/api/apiRequests";

import { SideBar } from "../../components/sidebar/SidebarComponent";
import { UsersComponent } from "../../components/users/UsersComponent";

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

  const pushBalance = async (userId, amount) => {
    try {
      await apiRequests.user.pushBalance(userId, { push_balance: amount });
      console.log("Баланс успешно пополнен");
    } catch (error) {
      console.error("Ошибка при пополнении баланса:", error);
    }
  };

  return (
    <div className="content">
      <UsersComponent getUsers={getData} pushBalance={pushBalance} />
    </div>
  );
};

export const UsersPage = () => {
  return (
    <>
      <Outlet />
      <div style={{ display: "flex" }}>
        <SideBar />
        <Users />
      </div>
    </>
  );
};
