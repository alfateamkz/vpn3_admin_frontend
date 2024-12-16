import { Outlet } from "react-router-dom";

import { apiRequests } from "../../shared/api/apiRequests";

import { SideBar } from "../../components/sidebar/SidebarComponent";
import { SettingsComponent } from "../../components/settings/SettingsComponent";

const Settings = () => {
  const getSettings = async () => {
    try {
      const response = await apiRequests.settings.all();
      return response.data;
    } catch (e) {
      const detail = e.response?.data?.detail;
      if (e.response?.status === 400) {
        alert(detail);
      }
      throw e;
    }
  };

  const editSettings = async (body) => {
    // body: {key: string, value: string}
    try {
      await apiRequests.settings.edit(body);
    } catch (error) {
      const detail = error.response?.data?.detail;
      alert(detail);
      console.error(error);
    }
  };

  const editPassword = async (body) => {
    // body: {old_password: string, new_password: string}
    try {
      await apiRequests.settings.editPassword(body);
      alert("Успешно!");
    } catch (error) {
      const detail = error.response?.data?.detail;
      alert(detail);
    }
  };

  return (
    <div className="content">
      <SettingsComponent
        getSettings={getSettings}
        editSettings={editSettings}
        editPassword={editPassword}
      />
    </div>
  );
};

export const SettingsPage = () => {
  return (
    <>
      <Outlet />
      <div style={{ display: "flex" }}>
        <SideBar />
        <Settings />
      </div>
    </>
  );
};
