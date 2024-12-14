import { Outlet } from "react-router-dom";

import { apiRequests } from "../../shared/api/apiRequests";

import { SideBar } from "../../components/sidebar/SidebarComponent";
import ServersTable from "../../components/servers/ServersComponent";

const Servers = () => {
  const getServers = async (page, limit) => {
    try {
      const response = await apiRequests.servers.all(page, limit);
      return response.data;
    } catch (e) {
      const detail = e.response?.data?.detail;
      if (e.response?.status === 400) {
        alert(detail);
      }
      throw e;
    }
  };

  const handleEdit = (server) => {
    console.log("Редактирование:", server);
  };

  const handleDelete = async (server_id) => {
    await apiRequests.servers
      .delete(server_id)
      .then((res) => {
        alert("Успешно удалено");
      })
      .catch((e) => {
        const detail = e.response.data.detail;
        if (e.response.code === 400) {
          alert(detail);
        }
      });
    console.log("Удаление:", server_id);
  };

  const handleSave = async (editedServer) => {
    await apiRequests.servers
      .edit(editedServer)
      .then((res) => {
        return res.data;
      })
      .catch((e) => {
        const detail = e.response.data.detail;
        if (e.response.code === 400) {
          alert(detail);
        }
      });
    console.log("Сохранение:", editedServer);
  };

  const handleAdd = async (newServer) => {
    await apiRequests.servers
      .add(newServer)
      .then((res) => {
        return res.data;
      })
      .catch((e) => {
        const detail = e.response.data.detail;
        if (e.response.code === 400) {
          alert(detail);
        }
      });
    console.log("Создание:", newServer);
  };

  return (
    <div>
      <ServersTable
        getServers={getServers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSave={handleSave}
        onCreate={handleAdd}
      />
    </div>
  );
};

export const ServersPage = () => {
  return (
    <>
      <Outlet />
      <div style={{ display: "flex" }}>
        <SideBar pageName="Серверы" />
        <Servers />
      </div>
    </>
  );
};
