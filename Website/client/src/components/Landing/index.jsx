import styles from "./styles.module.css";
import { Link } from "react-router-dom";
import image from 'c://Programm_React/Website/client/src/components/Pictures/sensor.png';
import image2 from 'c://Programm_React/Website/client/src/components/Pictures/module.png';
const Main = () => {
//Iot-Garden Automatisierung
	
	return (

		<div>
            <div className={styles.main_container}>
				<nav className={styles.navbar}>
					<h1>Iot-Garden  Planting</h1>
					<Link to="/login">
						<button type="button" className={styles.white_btn}>
							Log in
						</button>
					</Link>
				</nav>
		
				<div className={styles.picture1}>
					<img src={image} alt="Sensor im Boden" className={styles.img} />
					<h2 className={styles.infotext}>Iot-Garden</h2>
				</div>
				<div className={styles.picture2}>
					<img src={image2} alt="Sensor Controller" className={styles.img} />
				</div>
			</div>
		</div>
	);
};

export default Main;
