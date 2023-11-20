import { Route, Routes, Navigate, Link } from "react-router-dom";
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
import Actions from "./components/Actions";
import Devices from "./components/Devices";
import { Outlet } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import ServerError from "./components/ServerError/ServerError";
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

  // return (
  //   <>
  //     <div className="container">
  //       <Routes>
  //         {rightabo === "small" ||
  //         rightabo === "medium" ||
  //         rightabo === "big" ? (
  //           <Route element={<NavbarLayout />}>
  //             {user && <Route path="/navbar" element={<Navbar />} />}
  //             <Route
  //               path="/"
  //               element={user ? <Main /> : <Navigate replace to="/landing" />}
  //             />
  //             {user && <Route path="/history" element={<History />} />}
  //             {user && <Route path="/profile" element={<Profile />} />}
  //             {rightabo === "small" && (
  //               <Route path="/devices" element={<Devices />} />
  //             )}
  //             {rightabo === "small" && (
  //               <Route path="/notifications" element={<Notifications />} />
  //             )}
  //             {rightabo === "small" && (
  //               <Route path="/actions" element={<Actions />} />
  //             )}
  //             {rightabo === "big" && (
  //               <Route path="/notifications" element={<Notifications />} />
  //             )}
  //             {rightabo === "big" && (
  //               <Route path="/forecast" element={<Forecast />} />
  //             )}
  //             {rightabo === "big" && (
  //               <Route path="/calendar" element={<Calendar />} />
  //             )}
  //             <Route path="/imprint" element={<Imprint />}></Route>
  //             <Route path="/privacy" element={<Privacy />}></Route>
  //             <Route path="/doc" element={<Doc />} />
  //           </Route>
  //         ) : (
  //           <Route>
  //             {user ? (
  //               <Route
  //                 path="*"
  //                 element={
  //                   <div>
  //                     {showServerError ? (
  //                       <div
  //                         className="App"
  //                         style={{
  //                           position: "fixed",
  //                           top: 0,
  //                           left: 0,
  //                           width: "100%",
  //                           height: "100%",
  //                           display: "flex",
  //                           justifyContent: "center",
  //                           alignItems: "center",
  //                           backgroundColor:
  //                             "rgba(0, 0, 0, 0.5)" /* semi-transparent background */,
  //                           zIndex: 9999 /* ensure the modal is on top of other elements */,
  //                         }}
  //                       >
  //                         <div
  //                           style={{
  //                             alignItems: "center",
  //                             display: "flex",
  //                             justifyContent: "center",
  //                             backgroundColor: "#fff",
  //                             padding: "20px",
  //                             borderRadius: "10px",
  //                             marginLeft: "5%",
  //                             marginRight: "5%",
  //                           }}
  //                         >
  //                           <h1>
  //                             Server Error. Please try to re-login. If the error
  //                             persists, contact Support!
  //                           </h1>
  //                           <Link to="/logout">
  //                             <h1
  //                               style={{
  //                                 color: "#fff",
  //                                 padding: "12px 0",
  //                                 borderRadius: "20px",
  //                                 width: "120px",
  //                                 fontSize: "14px",
  //                                 cursor: "pointer",
  //                                 backgroundColor: "#13395a",
  //                                 margin: "10px",
  //                               }}
  //                             >
  //                               logout
  //                             </h1>
  //                           </Link>
  //                         </div>
  //                       </div>
  //                     ) : (
  //                       <div
  //                         className="App"
  //                         style={{
  //                           position: "fixed",
  //                           top: 0,
  //                           left: 0,
  //                           width: "100%",
  //                           height: "100%",
  //                           display: "flex",
  //                           justifyContent: "center",
  //                           alignItems: "center",
  //                           backgroundColor:
  //                             "rgba(0, 0, 0, 0.5)" /* semi-transparent background */,
  //                           zIndex: 9999 /* ensure the modal is on top of other elements */,
  //                         }}
  //                       >
  //                         <div
  //                           style={{
  //                             display: "flex",
  //                             justifyContent: "center",
  //                             alignItems: "center",
  //                             backgroundColor: "#fff",
  //                             padding: "20px",
  //                             borderRadius: "10px",
  //                           }}
  //                         >
  //                           <div
  //                             sytle={{
  //                               display: "flex",
  //                               justifyContent: "center", // Add this to center horizontally
  //                               alignItems: "center", // Add this to center vertically
  //                               height: "100vh",
  //                             }}
  //                           >
  //                             <h1>loading</h1>
  //                             <div
  //                               style={{
  //                                 display: "flex",
  //                                 justifyContent: "center",
  //                                 margin: "100px",
  //                               }}
  //                             >
  //                               <ClipLoader
  //                                 size={100}
  //                                 cssOverride={{
  //                                   margin: "0px",
  //                                 }}
  //                               />
  //                             </div>
  //                           </div>
  //                         </div>
  //                       </div>
  //                     )}
  //                   </div>
  //                 }
  //               />
  //             ) : null}
  //           </Route>
  //         )}

  //         <Route>
  //           <Route path="/landing" element={<Landing />} />
  //           <Route path="/signup" element={<Signup />} />
  //           <Route path="/login" element={<Login />} />
  //           <Route path="/logout" element={<Logout />} />
  //           <Route path="/password_reset" element={<Password_reset />} />
  //           <Route path="*" element={<NotFoundPage />} />
  //           <Route
  //             path="/reset_password/:userId/:token"
  //             element={<Reset_Password />}
  //           />
  //         </Route>
  //       </Routes>
  //       <Analytics />
  //     </div>
  //   </>
  // );
  return (
    <div className="container">
      <Routes>
        {user ? (
          rightabo === "small" ||
          rightabo === "medium" ||
          rightabo === "big" ? (
            <Route element={<NavbarLayout />}>
              <Route path="/navbar" element={<Navbar />} />
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
              <Route path="/imprint" element={<Imprint />}></Route>
              <Route path="/privacy" element={<Privacy />}></Route>
              <Route path="/doc" element={<Doc />} />
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

        <Route path="/landing" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/password_reset" element={<Password_reset />} />
        <Route
          path="/reset_password/:userId/:token"
          element={<Reset_Password />}
        />
      </Routes>
      <Analytics />
    </div>
  );
}

export default App;
