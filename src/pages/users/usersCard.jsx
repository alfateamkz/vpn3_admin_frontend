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

  const getLogs = async (page, limit, userId) => {
    try {
      const response = await apiRequests.user.logs(page, limit, userId);
      return response.data;
    } catch (e) {
      const detail = e.response?.data?.detail;
      if (e.response?.status === 400) {
        alert(detail);
      }
      throw e;
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
  
  const getDevices = async (user_id, page, limit) => {
    try {
      const response = await apiRequests.devices.list(user_id, page, limit);
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
    <div className="content">
      <UserCardComponent
        getUser={getUser}
        getLogs={getLogs}
        getPayments={getPayments}
        getUsers={getUsers}
        pushBalance={pushBalance}
        getDevices={getDevices}
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
