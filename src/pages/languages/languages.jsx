import { Outlet } from "react-router-dom";
import { SideBar } from "../../components/sidebar/SidebarComponent";
import { LanguagesComponent } from "../../components/languages/LanguagesComponent";

const Languages = () => {
  return (
    <div className="content">
      <LanguagesComponent />
    </div>
  );
};

export const LanguagesPage = () => {
  return (
    <>
      <Outlet />
      <div style={{ display: "flex" }}>
        <SideBar />
        <Languages />
      </div>
    </>
  );
};

