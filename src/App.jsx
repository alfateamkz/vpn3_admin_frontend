import "./App.scss";

import { Route, Routes } from "react-router-dom";

import { LoginPage } from "./pages/login/login.jsx";
import { ServersPage } from "./pages/servers/servers.jsx";
import { SubsPage } from "./pages/subs/subs.jsx";
import { StatsPage } from "./pages/stats/stats.jsx";
import { UsersPage } from "./pages/users/users.jsx";
import { UsersCardPage } from "./pages/users/usersCard.jsx";
import { SettingsPage } from "./pages/settings/setting.jsx";
import { ReferalsPage } from "./pages/referals/referals.jsx";
import { DevicesPage } from "./pages/devices/devices.jsx";
import { BroadcastPage } from "./pages/broadcast/broadcast.jsx";
import { IPWhitelistPage } from "./pages/ipWhitelist/ipWhitelist.jsx";
import { AdminActionsPage } from "./pages/adminActions/adminActions.jsx";
import { MonitoringPage } from "./pages/monitoring/monitoring.jsx";
import { PaymentLogsPage } from "./pages/paymentLogs/paymentLogs.jsx";
import { PayoutsPage } from "./pages/payouts/payouts.jsx";
import { ExportPage } from "./pages/export/export.jsx";
import { AdminsPage } from "./pages/admins/admins.jsx";
import { LanguagesPage } from "./pages/languages/languages.jsx";
import PaymentPage from "./components/payment/PaymentPage.jsx";
import PaymentSuccessPage from "./components/payment/PaymentSuccessPage.jsx";
import UserLoginPage from "./components/userLogin/UserLoginPage.jsx";
import UserDashboard from "./components/userDashboard/UserDashboard.jsx";

import LayoutPage from "./pages/Layout.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LayoutPage />}>
          <Route index element={<ServersPage />} /> {/* Главная страница */}
          <Route path="/servers" element={<ServersPage />} />
          <Route path="/subs" element={<SubsPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/:userId" element={<UsersCardPage />} />
          <Route path="/referals" element={<ReferalsPage />} />
          <Route path="/devices" element={<DevicesPage />} />
          <Route path="/broadcast" element={<BroadcastPage />} />
          <Route path="/ip-whitelist" element={<IPWhitelistPage />} />
          <Route path="/admin-actions" element={<AdminActionsPage />} />
          <Route path="/monitoring" element={<MonitoringPage />} />
          <Route path="/payment-logs" element={<PaymentLogsPage />} />
          <Route path="/payouts" element={<PayoutsPage />} />
          <Route path="/export" element={<ExportPage />} />
          <Route path="/admins" element={<AdminsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/languages" element={<LanguagesPage />} />
        </Route>
        <Route path="/auth" element={<LoginPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment/success" element={<PaymentSuccessPage />} />
        <Route path="/login" element={<UserLoginPage />} />
        <Route path="/dashboard" element={<UserDashboard />} />
      </Routes>
    </>
  );
}

export default App;
