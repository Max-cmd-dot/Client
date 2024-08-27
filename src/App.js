import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
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
import Notifications from "./components/Notifications";
import NotFoundPage from "./components/NotFoundPage";
import Profile from "./components/Profile";
import Imprint from "./components/Imprint";
import Privacy from "./components/Privacy";
import Actions from "./components/Actions";
import Devices from "./components/Devices";
import { Outlet } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import ServerError from "./components/ServerError/ServerError";
import CookieBanner from "./components/CookieBanner";

const apiUrl = process.env.REACT_APP_API_URL;

const NavbarLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get("token"));
  const [rightabo, setRightabo] = useState(null);
  const [showServerError, setShowServerError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowServerError(true);
    }, 20000); // 20 seconds
    return () => clearTimeout(timer); // cleanup on unmount
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const groupId = Cookies.get("groupId");
        console.log("group ID: ", groupId); // Debugging
        const response = await axios.get(
          `${apiUrl}/api/group/abo?group=${groupId}`,
          { withCredentials: true }
        );
        setRightabo(response.data.package);
      } catch (error) {
        console.error("Error fetching data:", error);
        setRightabo(false); // Set to false if there is an error
      }
    };

    if (isLoggedIn) {
      fetchData();
      const interval = setInterval(fetchData, 100000);
      return () => clearInterval(interval);
    } else {
      setRightabo(false); // Not logged in, set to false
    }
  }, [isLoggedIn]);

  if (rightabo === null) {
    return <LoadingScreen />; // Show loading screen while fetching data
  }

  return (
    <div className="container">
      <CookieBanner />
      <Routes>
        {isLoggedIn ? (
          rightabo === "small" ||
          rightabo === "medium" ||
          rightabo === "big" ? (
            <Route element={<NavbarLayout />}>
              <Route path="/" element={<Main />} />
              <Route path="/history" element={<History />} />
              <Route path="/profile" element={<Profile />} />
              {rightabo === "small" && (
                <Route path="/devices" element={<Devices />} />
              )}
              {rightabo === "small" && (
                <Route path="/notifications" element={<Notifications />} />
              )}
              {rightabo === "small" && (
                <Route path="/actions" element={<Actions />} />
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
            </Route>
          ) : (
            <Route
              path="*"
              element={showServerError ? <ServerError /> : <LoadingScreen />}
            />
          )
        ) : (
          <Route path="*" element={<Navigate replace to="/landing" />} />
        )}

        <Route path="/imprint" element={<Imprint />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/logout"
          element={<Logout setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path="/password_reset" element={<Password_reset />} />
        <Route
          path="/reset_password/:userId/:token"
          element={<Reset_Password />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <SpeedInsights />
      <Analytics />
    </div>
  );
}

export default App;
