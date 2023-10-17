import React, { useState, useEffect } from "react";
import * as FaIcons from "react-icons/fa";
import { Link } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import { SidebarData2 } from "./SidebarData2";
import { SidebarData3 } from "./SidebarData3";
import "./Navbar.css";
import { IconContext } from "react-icons";
import axios from "axios";
import { useDispatch } from "react-redux";
import { changeRoute } from "../../reduxStore";
import * as bifrom from "react-icons/bi";
import * as feathericons from "react-icons/fi";

const apiUrl = process.env.REACT_APP_API_URL;

function Navbar() {
  const [sidebar, setSidebar] = useState(false);
  const [rightabo, setRightabo] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  const group = localStorage.getItem("groupId");
  const dispatch = useDispatch();

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
    const interval = setInterval(fetchData, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const renderSidebarData = () => {
    if (rightabo === "small") {
      return SidebarData.map((item, index) => (
        <li key={index} className={item.cName}>
          <Link to={item.path} onClick={() => dispatch(changeRoute(item.path))}>
            {item.icon}
            <span>{item.title}</span>
          </Link>
        </li>
      ));
    }
    if (rightabo === "medium") {
      return SidebarData2.map((item, index) => (
        <li key={index} className={item.cName}>
          <Link to={item.path} onClick={() => dispatch(changeRoute(item.path))}>
            {item.icon}
            <span>{item.title}</span>
          </Link>
        </li>
      ));
    }
    if (rightabo === "big") {
      return SidebarData3.map((item, index) => (
        <li key={index} className={item.cName}>
          <Link to={item.path} onClick={() => dispatch(changeRoute(item.path))}>
            {item.icon}
            <span>{item.title}</span>
          </Link>
        </li>
      ));
    } else {
      return (
        <>
          <h1>ERROR please log out</h1>
          <Link to="/logout">
            <h1 className="button">logout</h1>
          </Link>
        </>
      );
    }
  };

  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <div className="navbar">
          <div className="logo">
            <Link to="#" className="menu-bars">
              <FaIcons.FaBars onClick={showSidebar} />
            </Link>
          </div>
          <div className="profile_picture">
            {rightabo === "big" ? (
              <Link to="/notifications" className="icons">
                <bifrom.BiBell />
              </Link>
            ) : (
              <></>
            )}
            <Link to="/profile" className="icons">
              <feathericons.FiUser />
            </Link>
            <Link to="/logout" className="icons">
              <feathericons.FiLogOut />
            </Link>
          </div>
        </div>
        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items" onClick={showSidebar}>
            <li className="navbar-toggle">
              <Link to="#" className="menu-bars">
                <FaIcons.FaBars />
              </Link>
            </li>

            {renderSidebarData()}

            <div className="footer">
              <div className="imprint">
                <Link className="imprint" to="/Imprint">
                  Imprint
                </Link>
                <Link className="imprint" to="/Privacy">
                  Privacy
                </Link>
              </div>
            </div>
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default Navbar;
