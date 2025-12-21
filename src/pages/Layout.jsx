import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import Cookies from "js-cookie";
// src/components/sidebar/Sidebar.jsx

// import { SideBar } from "../components/sidebar/SidebarComponent";

// import { apiRequests } from "../shared/api/apiRequests";
// import { setUserData, setUserPicture, setSubPrice } from "../shared/store/main";

const LayoutPage = (props) => {
  // const dispatch = useDispatch();
  const isLoading = false;
  // Исправляем селектор - не используем весь state
  // const { mainSlice } = useSelector((state) => state);
  const navigate = useNavigate();

  useEffect(() => {
    // console.log(mainSlice.user);

    const getData = async () => {
      // Получить данные юзера, если есть access_token
      if (Cookies.get("accessToken")) {
        // setLoading(true);
        // if (Object.keys(mainSlice.user).length === 0) {
        //     await apiRequests.user
        //         .getData()
        //         .then((res) => {
        //             dispatch(setUserData(res.data));
        //             setLoading(false);
        //             return res.data;
        //         })
        // }
        // setLoading(false);

        return false;
      } else {
        navigate("/auth");
      }
    };
    getData();
  }, [navigate]);

  if (isLoading) {
    return <div>'Идёт загрузка...'</div>;
  }

  return (
    <>
      <Outlet />
      <div style={{ display: "flex" }}>
        {/* <SideBar /> */}
        {/* <div style={{ flex: 1, padding: "20px" }}>
          <h1>Контент страницы</h1>
        </div> */}
      </div>
    </>
  );
};

export default LayoutPage;
