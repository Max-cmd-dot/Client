import { Route, Routes, Navigate } from "react-router-dom";
import Main from "./components/Main";
import Signup from "./components/Singup";
import Login from "./components/Login";
import Landing from "./components/Landing";
import Navbar from "./components/Navbar";
import Logout from "./components/Logout";
import History from "./components/History";
import Password_reset from "./components/Password_reset";
import Reset_Passwort from "./components/Reset_Password";
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
  //<Route path="/notifications" exact element={<Notifications />} />
  return (
    <>
      <div className="container">
        <Routes>
          <Route element={<NavbarLayout />}>
            {user && <Route path="/" exact element={<Main />} />}
            {user && <Route path="/navbar" exact element={<Navbar />} />}
            <Route path="/" element={<Navigate replace to="/landing" />} />
            {user && <Route path="/history" exact element={<History />} />}
            {user && <Route path="/Profile" exact element={<Profile />} />}
            <Route path="/notifications" exact element={<Notifications />} />
            <Route path="/doc" exact element={<Doc />} />
          </Route>
          <Route>
            <Route path="/landing" exact element={<Landing />} />
            <Route path="/signup" exact element={<Signup />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/logout" exact element={<Logout />} />
            <Route path="/password_reset" exact element={<Password_reset />} />
            <Route path="*" exact element={<NotFoundPage />} />
            <Route
              path="/reset_password/:userId/:token"
              exact
              element={<Reset_Passwort />}
            />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
