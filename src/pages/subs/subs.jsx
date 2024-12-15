import { Outlet } from "react-router-dom";

import { apiRequests } from "../../shared/api/apiRequests";

import { SideBar } from "../../components/sidebar/SidebarComponent";
import SubsTable from "../../components/subs/SubsComponent";

const Subs = () => {
  const getData = async (page, limit) => {
    try {
      const response = await apiRequests.subs.all(page, limit);
      return response.data;
    } catch (e) {
      const detail = e.response?.data?.detail;
      if (e.response?.status === 400) {
        alert(detail);
      }
      throw e;
    }
  };

  const handleEdit = (data) => {
    console.log("Редактирование:", data);
  };

  const handleDelete = async (item_id) => {
    await apiRequests.subs
      .delete(item_id)
      .then((res) => {
        alert("Успешно удалено");
      })
      .catch((e) => {
        const detail = e.response.data.detail;
        if (e.response.code === 400) {
          alert(detail);
        }
      });
    console.log("Удаление:", item_id);
  };

  const handleSave = async (editedData) => {
    await apiRequests.subs
      .edit(editedData)
      .then((res) => {
        return res.data;
      })
      .catch((e) => {
        const detail = e.response.data.detail;
        if (e.response.code === 400) {
          alert(detail);
        }
      });
    console.log("Сохранение:", editedData);
  };

  const handleAdd = async (newData) => {
    await apiRequests.subs
      .add(newData)
      .then((res) => {
        return res.data;
      })
      .catch((e) => {
        const detail = e.response.data.detail;
        if (e.response.code === 400) {
          alert(detail);
        }
      });
    console.log("Создание:", newData);
  };

  return (
    <div className="content">
      <SubsTable
        getData={getData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSave={handleSave}
        onCreate={handleAdd}
      />
    </div>
  );
};

export const SubsPage = () => {
  return (
    <>
      <Outlet />
      <div style={{ display: "flex" }}>
        <SideBar />
        <Subs />
      </div>
    </>
  );
};
