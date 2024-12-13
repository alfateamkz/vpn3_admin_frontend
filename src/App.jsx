// import { Header } from './components/header/header.jsx';
// import { Intro } from './components/intro/intro.jsx';
// import { Companies } from './components/companies/companies.jsx';
// import { CompanieFeatures } from './components/features/features.jsx';
// import { RoadMap } from './components/roadMap/roadMap.jsx';
// import { OurAchievements } from './components/ourAchievements/ourAchievements.jsx';
// import { Information } from './components/information/information.jsx';
// import { Footer } from './components/footer/footer.jsx';

// import { Profile } from './pages/profile/profile.jsx';
// import { EditProfile } from './pages/editProfile/editProfile.jsx';
// import { EditPassword } from './pages/editPassword/editPassword.jsx';

import "./App.scss";

import { Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/login/login.jsx";

import LayoutPage from "./pages/Layout.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LayoutPage />}></Route>
        <Route path={"/auth"} element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;
