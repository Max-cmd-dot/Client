import { Route, Routes, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Main from "./components/Main";
import Signup from "./components/Singup";
import Login from "./components/Login";
import Landing from "./components/Landing";
import Navbar from "./components/Navbar";
import Logout from "./components/Logout";
import History from "./components/History";
import Forecast from "./components/Forecast";
import Calendar from "./components/Calendar";
import Password_reset from "./components/Password_reset";
import Reset_Password from "./components/Reset_Password";
import Doc from "./components/Doc";
import Notifications from "./components/Notifications";
import NotFoundPage from "./components/NotFoundPage";
import Profile from "./components/Profile";
import Imprint from "./components/Imprint";
import Privacy from "./components/Privacy";
import { Outlet } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
const apiUrl = process.env.REACT_APP_API_URL;
const NavbarLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

function App() {
  const user = localStorage.getItem("token");
  const [rightabo, setRightabo] = useState(false);
  const group = localStorage.getItem("groupId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/group/abo?group=${group}`
        );
        setRightabo(response.data.package);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 100000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <div className="container">
        <Routes>
          <Route element={<NavbarLayout />}>
            {user && <Route path="/" element={<Main />} />}
            {user && <Route path="/navbar" element={<Navbar />} />}
            <Route path="/" element={<Navigate replace to="/landing" />} />
            {user && <Route path="/history" element={<History />} />}
            {user && <Route path="/profile" element={<Profile />} />}
            {rightabo === "medium" && (
              <Route path="/notifications" element={<Notifications />} />
            )}
            {rightabo === "big" && (
              <Route path="/notifications" element={<Notifications />} />
            )}
            {rightabo === "big" && (
              <Route path="/forecast" element={<Forecast />} />
            )}
            {rightabo === "big" && (
              <Route path="/calendar" element={<Calendar />} />
            )}
            <Route path="/imprint" element={<Imprint />}></Route>
            <Route path="/privacy" element={<Privacy />}></Route>
            <Route path="/doc" element={<Doc />} />
          </Route>
          <Route>
            <Route path="/landing" element={<Landing />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/password_reset" element={<Password_reset />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route
              path="/reset_password/:userId/:token"
              element={<Reset_Password />}
            />
          </Route>
        </Routes>
        <Analytics />
      </div>
    </>
  );
}

export default App;
