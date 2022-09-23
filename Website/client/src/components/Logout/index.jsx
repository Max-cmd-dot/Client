import styles from "./styles.module.css";
import { Link } from "react-router-dom";


const Logout = () => {
	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();

	};

	return (
		<div className={styles.login_container}>
			<div className={styles.login_form_container}>
				<div className={styles.left}>
					<form className={styles.form_container} onSubmit={handleLogout}>
						<h1>Are you sure to Log out?</h1>
							<Link to="/Landing">
								<button type="submit" className={styles.green_btn}>
									Confirm
								</button>
						</Link>
					</form>
				</div>
				<div className={styles.right}>
					<h1>Nope?</h1>
					<Link to="/">
						<button type="button" className={styles.white_btn}>
							Go Back
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Logout;