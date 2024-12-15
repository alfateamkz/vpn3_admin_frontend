import "./App.scss";

import { Route, Routes } from "react-router-dom";

import { LoginPage } from "./pages/login/login.jsx";
import { ServersPage } from "./pages/servers/servers.jsx";
import { SubsPage } from "./pages/subs/subs.jsx";
import { StatsPage } from "./pages/stats/stats.jsx";
import { UsersPage } from "./pages/users/users.jsx";

import LayoutPage from "./pages/Layout.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LayoutPage />}></Route>
        <Route path={"/auth"} element={<LoginPage />} />
        <Route path={"/servers"} element={<ServersPage />} />
        <Route path={"/subs"} element={<SubsPage />} />
        <Route path={"/stats"} element={<StatsPage />} />
        <Route path={"/users"} element={<UsersPage />} />
      </Routes>
    </>
  );
}

export default App;
