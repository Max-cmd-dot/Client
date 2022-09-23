import { Route, Routes, Navigate } from "react-router-dom";
import Main from "./components/Main";
import Signup from "./components/Singup";
import Login from "./components/Login";
import Landing from "./components/Landing";
import Navbar from './components/Navbar';
import Logout from './components/Logout';
import Notifications from './components/Notifications';
import { Outlet } from 'react-router-dom';

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
			
				<Route element={<NavbarLayout/>}>
					{user && <Route path="/" exact element={<Main />} />}
					<Route path="/navbar" exact element={<Navbar />} />
					<Route path="/" element={<Navigate replace to="/landing" />} />
				</Route>
					<Route path="/landing" exact element={<Landing />} />
					<Route path="/signup" exact element={<Signup />} />
					<Route path="/login" exact element={<Login />} />
					<Route path="/logout" exact element={<Logout />} />
				</Routes>
			</div>
		</>
	);
}

export default App;
