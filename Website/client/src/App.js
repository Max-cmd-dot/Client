import { Route, Routes, Navigate } from "react-router-dom";
import Main from "./components/Main";
import Signup from "./components/Singup";
import Login from "./components/Login";
import Landing from "./components/Landing";
import Navbar from "./components/Navbar";
import Logout from "./components/Logout";
import History from "./components/History";
import Password_reset from "./components/Password_reset";
import Reset_Password from "./components/Reset_Password";
import Doc from "./components/Doc";
import Notifications from "./components/Notifications";
import NotFoundPage from "./components/NotFoundPage";
import Profile from "./components/Profile";
import { Outlet } from "react-router-dom";

const NavbarLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

function App() {
  const user = localStorage.getItem("token");

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
            <Route path="/notifications" element={<Notifications />} />
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
      </div>
    </>
  );
}

export default App;
