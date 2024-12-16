import { Outlet } from "react-router-dom";

import { apiRequests } from "../../shared/api/apiRequests";

import { SideBar } from "../../components/sidebar/SidebarComponent";
import { UserCardComponent } from "../../components/users/UsersCardComponent";

const UsersCard = () => {
  const getUser = async (userId) => {
    try {
      const response = await apiRequests.user.one(userId);
      return response.data;
    } catch (e) {
      const detail = e.response?.data?.detail;
      if (e.response?.status === 400) {
        alert(detail);
      }
      throw e;
    }
  };

  const getUsers = async (page, limit, search, referal_id) => {
    try {
      const response = await apiRequests.user.all(
        page,
        limit,
        search,
        referal_id
      );
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

  const getPayments = async (page, limit, type, user_id) => {
    try {
      const response = await apiRequests.payments.all(
        page,
        limit,
        type,
        user_id
      );
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
    <div className="content">
      <UserCardComponent
        getUser={getUser}
        getUsers={getUsers}
        pushBalance={pushBalance}
        getPayments={getPayments}
      />
    </div>
  );
};

export const UsersCardPage = () => {
  return (
    <>
      <Outlet />
      <div style={{ display: "flex" }}>
        <SideBar />
        <UsersCard />
      </div>
    </>
  );
};
