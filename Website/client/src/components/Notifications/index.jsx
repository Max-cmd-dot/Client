import styles from "./styles.module.css";
import React, {useState, useEffect} from "react"
import axios from 'axios'
const Notifications = () => {
    let [list, setList] = useState([]);
    //Iot-Garden Automatisierung
    useEffect(() => {
        axios.get('https://20.219.193.229:8080/api/data/latestdata/all')
        .then(function (response) {
          const valuesArr = []
          //const valueNameArr = []
          let counter = 0
          for (let item in response.data) {
            //console.log(response.data[item].location.coordinates);
            if(counter < 100)

            valuesArr.push(

                {
                topic:	response.data[item].topic,
                
                value: response.data[item].value,
             })
            counter ++;
         
           }
           setList(valuesArr)
       
        })
    
    
     }); 
	return (

		<div>
            <h1 className={styles.heading}>Notifications</h1>
                <p className={styles.alerts}>
                    Alerts from System
                </p>
                <p className={styles.actions}>
                    Actions from System
                </p>
		</div>
	);
};

export default Notifications;