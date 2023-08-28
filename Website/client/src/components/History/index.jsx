import styles from "./styles.module.css";
import { Line, Scatter, Tooltip } from "react-chartjs-2";
import "chartjs-adapter-moment";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
const apiUrl = process.env.REACT_APP_API_URL;
import {
  Chart,
  ArcElement,
  CategoryScale,
  LineElement,
  LinearScale,
  PointElement,
  TimeScale,
} from "chart.js";

Chart.register(
  ArcElement,
  CategoryScale,
  LineElement,
  LinearScale,
  PointElement,
  TimeScale
);
const History = () => {
  const groupId = localStorage.getItem("groupId");
  const [count_chart_1, setcount_chart_1] = useState(100);
  let [tempchardata, settempchardata] = useState([]);
  let [humchardata, sethumchardata] = useState([]);
  let [luxchardata, setluxchardata] = useState([]);
  let [moi1chardata, setmoi1chardata] = useState([]);
  let [moi2chardata, setmoi2chardata] = useState([]);
  let [moi3chardata, setmoi3chardata] = useState([]);
  const [isLoading_chart_1, setIsLoading_chart_1] = useState(false);
  const [isLoading_chart_2, setIsLoading_chart_2] = useState(false);
  const [isLoading_chart_3, setIsLoading_chart_3] = useState(false);
  const [isLoading_chart_4, setIsLoadingchart_4] = useState(false);
  const [loadingTime_1, setLoadingTime_1] = useState(false);
  const [loadingTime_2, setLoadingTime_2] = useState(false);
  const [loadingTime_3, setLoadingTime_3] = useState(false);
  const [loadingTime_4, setLoadingTime_4] = useState(false);
  const [chart1Checked, setChart1Checked] = useState(true);
  const [chart2Checked, setChart2Checked] = useState(false);
  const [chart3Checked, setChart3Checked] = useState(false);
  const [chart4Checked, setChart4Checked] = useState(false);
  const [type_chart_1, settype_chart_1] = useState(1);
  const [update_interval_value_chart_1, setupdate_interval_value_chart_1] =
    useState(15000);
  const [update_interval_value_chart_2, setupdate_interval_value_chart_2] =
    useState(15000);
  const [update_interval_value_chart_3, setupdate_interval_value_chart_3] =
    useState(15000);
  const [update_interval_value_chart_4, setupdate_interval_value_chart_4] =
    useState(15000);
  const [
    update_data_interval_value_chart_1,
    setupdate_data_interval_value_chart_1,
  ] = useState(15000);
  const [
    update_data_interval_value_chart_2,
    setupdate_data_interval_value_chart_2,
  ] = useState(15000);
  const [
    update_data_interval_value_chart_3,
    setupdate_data_interval_value_chart_3,
  ] = useState(15000);
  const [
    update_data_interval_value_chart_4,
    setupdate_data_interval_value_chart_4,
  ] = useState(15000);
  //general buttons
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  //chart 1 datasets checks
  const [
    dataset_temperature_Chart1Checked,
    setDataset_temperature_Chart1Checked,
  ] = useState(true);
  const [dataset_humidity_Chart1Checked, setDataset_humidity_Chart1Checked] =
    useState(false);
  const [dataset_moisture_Chart1Checked, setdataset_moisture_Chart1Checked] =
    useState(false);
  const [dataset_lux_Chart1Checked, setdataset_lux_Chart1Checked] =
    useState(false);
  const [IsEditPopupOpen_1, setIsEditPopupOpen_1] = useState(false);
  const [IsDataPopupOpen_1, setIsDataPopupOpen_1] = useState(false);
  const [IsCountPopupOpen_1, setIsCountPopupOpen_1] = useState(false);
  const [IsTypePopupOpen_1, setIsTypePopupOpen_1] = useState(false);
  const [IsIntervalPopupOpen_1, setIsIntervalPopupOpen_1] = useState(false);

  //chart 2 datasets checks
  const [
    dataset_temperature_Chart2Checked,
    setDataset_temperature_Chart2Checked,
  ] = useState(false);
  const [dataset_humidity_Chart2Checked, setDataset_humidity_Chart2Checked] =
    useState(true);
  const [dataset_moisture_Chart2Checked, setdataset_moisture_Chart2Checked] =
    useState(false);
  const [dataset_lux_Chart2Checked, setdataset_lux_Chart2Checked] =
    useState(false);
  const [IsEditPopupOpen_2, setIsEditPopupOpen_2] = useState(false);
  const [IsIntervalPopupOpen_2, setIsIntervalPopupOpen_2] = useState(false);

  //chart 3 datasets checks
  const [
    dataset_temperature_Chart3Checked,
    setDataset_temperature_Chart3Checked,
  ] = useState(false);
  const [dataset_humidity_Chart3Checked, setDataset_humidity_Chart3Checked] =
    useState(false);
  const [dataset_moisture_Chart3Checked, setdataset_moisture_Chart3Checked] =
    useState(true);
  const [dataset_lux_Chart3Checked, setdataset_lux_Chart3Checked] =
    useState(false);
  const [IsEditPopupOpen_3, setIsEditPopupOpen_3] = useState(false);
  const [IsIntervalPopupOpen_3, setIsIntervalPopupOpen_3] = useState(false);

  //chart 4 datasets checks
  const [
    dataset_temperature_Chart4Checked,
    setDataset_temperature_Chart4Checked,
  ] = useState(false);
  const [dataset_humidity_Chart4Checked, setDataset_humidity_Chart4Checked] =
    useState(false);
  const [dataset_moisture_Chart4Checked, setdataset_moisture_Chart4Checked] =
    useState(false);
  const [dataset_lux_Chart4Checked, setdataset_lux_Chart4Checked] =
    useState(true);
  const [IsEditPopupOpen_4, setIsEditPopupOpen_4] = useState(false);
  const [IsIntervalPopupOpen_4, setIsIntervalPopupOpen_4] = useState(false);

  //general settings
  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  //chart 1
  const openEditPopup_1 = () => {
    setIsEditPopupOpen_1(true);
  };

  const closeEditPopup_1 = () => {
    setIsEditPopupOpen_1(false);
  };
  const openIntervalPopup_1 = () => {
    setIsIntervalPopupOpen_1(true);
  };

  const closeIntervalPopup_1 = () => {
    setIsIntervalPopupOpen_1(false);
  };
  const openDataPopup_1 = () => {
    setIsDataPopupOpen_1(true);
  };

  const closeDataPopup_1 = () => {
    setIsDataPopupOpen_1(false);
  };
  const openCountPopup_1 = () => {
    setIsCountPopupOpen_1(true);
  };

  const closeCountPopup_1 = () => {
    setIsCountPopupOpen_1(false);
  };
  const openTypePopup_1 = () => {
    setIsTypePopupOpen_1(true);
  };

  const closeTypePopup_1 = () => {
    setIsTypePopupOpen_1(false);
  };
  const addFilter_1 = () => {
    console.log("Added filter");
  };

  const edit_chart_number = () => {
    console.log("edit chart number");
    openPopup();
  };

  const live_data_1 = () => {
    console.log("live data_1");
  };
  const handleIntervalChange_chart_1 = (event) => {
    //gets value of drop down
    const selectedInterval_chart_1 = parseInt(event.target.value);
    //updates the value of the interval
    setupdate_interval_value_chart_1(selectedInterval_chart_1);
  };
  const handleDataIntervalChange_chart_1 = (event) => {
    //gets value of drop down
    const selectedDataInterval_chart_1 = parseInt(event.target.value);
    //updates the value of the interval
    setupdate_data_interval_value_chart_1(selectedDataInterval_chart_1);
  };
  const handleCountChange_chart_1 = (event) => {
    //gets value of drop down
    const selectedCount_chart_1 = parseInt(event.target.value);
    //updates the value of the interval
    setcount_chart_1(selectedCount_chart_1);
  };
  const handleTypeChange_chart_1 = (event) => {
    //gets value of drop down
    const selectedType_chart_1 = parseInt(event.target.value);
    //updates the value of the interval
    settype_chart_1(selectedType_chart_1);
  };
  //chart 2
  const openEditPopup_2 = () => {
    setIsEditPopupOpen_2(true);
  };
  const closeEditPopup_2 = () => {
    setIsEditPopupOpen_2(false);
  };
  const openIntervalPopup_2 = () => {
    setIsIntervalPopupOpen_2(true);
  };

  const closeIntervalPopup_2 = () => {
    setIsIntervalPopupOpen_2(false);
  };
  const addFilter_2 = () => {
    console.log("Added filter");
  };
  const change_type_2 = () => {
    console.log("Added filter_2");
  };
  const max_count_values_2 = () => {
    console.log("Added chart _2");
  };
  const data_interval_2 = () => {
    console.log("Added chart _2");
  };
  const live_data_2 = () => {
    console.log("live data _2");
  };
  const update_interval_2 = () => {
    console.log("update interval _2");
  };

  //chart 3
  const openEditPopup_3 = () => {
    setIsEditPopupOpen_3(true);
  };

  const closeEditPopup_3 = () => {
    setIsEditPopupOpen_3(false);
  };
  const openIntervalPopup_3 = () => {
    setIsIntervalPopupOpen_3(true);
  };

  const closeIntervalPopup_3 = () => {
    setIsIntervalPopupOpen_3(false);
  };
  const addFilter_3 = () => {
    console.log("Added filter");
  };
  const change_type_3 = () => {
    console.log("Added filter _3");
  };
  const max_count_values_3 = () => {
    console.log("Added chart _3");
  };
  const data_interval_3 = () => {
    console.log("Added chart _3");
  };
  const live_data_3 = () => {
    console.log("live data _3");
  };
  const update_interval_3 = () => {
    console.log("update interval _3");
  };

  //chart 4
  const openEditPopup_4 = () => {
    setIsEditPopupOpen_4(true);
  };

  const closeEditPopup_4 = () => {
    setIsEditPopupOpen_4(false);
  };
  const openIntervalPopup_4 = () => {
    setIsIntervalPopupOpen_4(true);
  };

  const closeIntervalPopup_4 = () => {
    setIsIntervalPopupOpen_4(false);
  };
  const addFilter_4 = () => {
    console.log("Added filter");
  };
  const change_type_4 = () => {
    console.log("Added filter _4");
  };
  const max_count_values_4 = () => {
    console.log("Added chart _4");
  };
  const data_interval_4 = () => {
    console.log("Added chart _4");
  };
  const live_data_4 = () => {
    console.log("live data _4");
  };
  const update_interval_4 = () => {
    console.log("update interval _4");
  };
  useEffect(() => {
    let isMounted = true;
    const fetchdata_chart_1 = async () => {
      try {
        setLoadingTime_1(Date.now());

        const checkboxPromise_Lux = [];
        const checkboxPromise_Humidity = [];
        const checkboxPromise_Temperature = [];
        const checkboxPromise_Moisture = [];

        if (dataset_temperature_Chart1Checked) {
          checkboxPromise_Temperature.push(
            axios.get(
              `${apiUrl}/api/data/all/temperature?groupId=${groupId}&count=${count_chart_1}`
            )
          );
        }
        if (dataset_humidity_Chart1Checked) {
          checkboxPromise_Humidity.push(
            axios.get(`${apiUrl}/api/data/all/humidity?groupId=${groupId}`)
          );
        }
        if (dataset_moisture_Chart1Checked) {
          checkboxPromise_Moisture.push(
            axios.get(`${apiUrl}/api/data/all/moisture/1?groupId=${groupId}`)
          );
          checkboxPromise_Moisture.push(
            axios.get(`${apiUrl}/api/data/all/moisture/2?groupId=${groupId}`)
          );
          checkboxPromise_Moisture.push(
            axios.get(`${apiUrl}/api/data/all/moisture/3?groupId=${groupId}`)
          );
        }
        if (dataset_lux_Chart1Checked) {
          checkboxPromise_Lux.push(
            axios.get(`${apiUrl}/api/data/all/lux?groupId=${groupId}`)
          );
        }
        const response_Moisture = await Promise.all(checkboxPromise_Moisture);
        const response_Humdidity = await Promise.all(checkboxPromise_Humidity);
        const response_Temperature = await Promise.all(
          checkboxPromise_Temperature
        );
        const response_Lux = await Promise.all(checkboxPromise_Lux);

        if (chart1Checked) {
          if (dataset_temperature_Chart1Checked) {
            const temperatureDataArr = [];
            let countertemperature = 0;
            for (let thing in response_Temperature[0].data) {
              if (countertemperature < 10000) {
                temperatureDataArr.push({
                  time: response_Temperature[0].data[thing].time,
                  value: response_Temperature[0].data[thing].value,
                });
                countertemperature++;
              }
            }
            const reversedtemperatureDataArr = temperatureDataArr.reverse();

            if (isMounted) {
              settempchardata(reversedtemperatureDataArr);
            }
          }
          //humidity data
          if (dataset_humidity_Chart1Checked) {
            const humidityDataArr = [];
            let counterhumidity = 0;
            for (let thing in response_Humdidity[0].data) {
              if (counterhumidity < 100) {
                humidityDataArr.push({
                  time: response_Humdidity[0].data[thing].time,
                  value: response_Humdidity[0].data[thing].value,
                });
                counterhumidity++;
              }
            }
            const reversedhumidityDataArr = humidityDataArr.reverse();

            if (isMounted) {
              sethumchardata(reversedhumidityDataArr);
            }
          }
          //moisture data
          if (dataset_moisture_Chart1Checked) {
            const moisture1DataArr = [];
            let countermoisture1 = 0;
            for (let thing in response_Moisture[0].data) {
              if (countermoisture1 < 100) {
                moisture1DataArr.push({
                  time: response_Moisture[0].data[thing].time,
                  value: response_Moisture[0].data[thing].value,
                });
                countermoisture1++;
              }
            }
            const reversedmoisture1DataArr = moisture1DataArr.reverse();

            const moisture2DataArr = [];
            let countermoisture2 = 0;
            for (let thing in response_Moisture[0].data) {
              if (countermoisture2 < 100) {
                moisture2DataArr.push({
                  time: response_Moisture[0].data[thing].time,
                  value: response_Moisture[0].data[thing].value,
                });
                countermoisture2++;
              }
            }
            const reversedmoisture2DataArr = moisture2DataArr.reverse();

            const moisture3DataArr = [];
            let countermoisture3 = 0;
            for (let thing in response_Moisture[0].data) {
              if (countermoisture3 < 100) {
                moisture3DataArr.push({
                  time: response_Moisture[0].data[thing].time,
                  value: response_Moisture[0].data[thing].value,
                });
                countermoisture3++;
              }
            }
            const reversedmoisture3DataArr = moisture3DataArr.reverse();

            if (isMounted) {
              setmoi1chardata(reversedmoisture1DataArr);
              setmoi2chardata(reversedmoisture2DataArr);
              setmoi3chardata(reversedmoisture3DataArr);
            }
          }
          if (dataset_lux_Chart1Checked) {
            const luxDataArr = [];
            let counterlux = 0;
            for (let thing in response_Lux[0].data) {
              if (counterlux < 100) {
                luxDataArr.push({
                  time: response_Lux[0].data[thing].time,
                  value: response_Lux[0].data[thing].value,
                });
                counterlux++;
              }
            }
            const reversedluxDataArr = luxDataArr.reverse();

            if (isMounted) {
              setluxchardata(reversedluxDataArr);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        if (isMounted) {
          const elapsedTime = Date.now() - loadingTime_1;
          if (elapsedTime > 100) {
            setIsLoading_chart_1(true);
          }
        }
      }
    };
    const fetchdata_chart_2 = async () => {
      try {
        setIsLoading_chart_2(true);
        const checkboxPromise_Lux = [];
        const checkboxPromise_Humidity = [];
        const checkboxPromise_Temperature = [];
        const checkboxPromise_Moisture = [];
        if (dataset_temperature_Chart2Checked) {
          checkboxPromise_Temperature.push(
            axios.get(`${apiUrl}/api/data/all/temperature?groupId=${groupId}`)
          );
        }
        if (dataset_humidity_Chart2Checked) {
          checkboxPromise_Humidity.push(
            axios.get(`${apiUrl}/api/data/all/humidity?groupId=${groupId}`)
          );
        }
        if (dataset_moisture_Chart2Checked) {
          checkboxPromise_Moisture.push(
            axios.get(`${apiUrl}/api/data/all/moisture/1?groupId=${groupId}`)
          );
          checkboxPromise_Moisture.push(
            axios.get(`${apiUrl}/api/data/all/moisture/2?groupId=${groupId}`)
          );
          checkboxPromise_Moisture.push(
            axios.get(`${apiUrl}/api/data/all/moisture/3?groupId=${groupId}`)
          );
        }
        if (dataset_lux_Chart2Checked) {
          checkboxPromise_Lux.push(
            axios.get(`${apiUrl}/api/data/all/lux?groupId=${groupId}`)
          );
        }
        const response_Moisture = await Promise.all(checkboxPromise_Moisture);
        const response_Humdidity = await Promise.all(checkboxPromise_Humidity);
        const response_Temperature = await Promise.all(
          checkboxPromise_Temperature
        );
        const response_Lux = await Promise.all(checkboxPromise_Lux);
        if (dataset_temperature_Chart2Checked) {
          const temperatureDataArr = [];
          let countertemperature = 0;
          for (let thing in response_Temperature[0].data) {
            if (countertemperature < 100) {
              temperatureDataArr.push({
                time: response_Temperature[0].data[thing].time,
                value: response_Temperature[0].data[thing].value,
              });
              countertemperature++;
            }
          }
          const reversedtemperatureDataArr = temperatureDataArr.reverse();

          if (isMounted) {
            settempchardata(reversedtemperatureDataArr);
          }
        }
        //humidity data
        if (dataset_humidity_Chart2Checked) {
          const humidityDataArr = [];
          let counterhumidity = 0;
          for (let thing in response_Humdidity[0].data) {
            if (counterhumidity < 100) {
              humidityDataArr.push({
                time: response_Humdidity[0].data[thing].time,
                value: response_Humdidity[0].data[thing].value,
              });
              counterhumidity++;
            }
          }
          const reversedhumidityDataArr = humidityDataArr.reverse();

          if (isMounted) {
            sethumchardata(reversedhumidityDataArr);
          }
        }
        //moisture data
        if (dataset_moisture_Chart2Checked) {
          const moisture1DataArr = [];
          let countermoisture1 = 0;
          for (let thing in response_Moisture[0].data) {
            if (countermoisture1 < 100) {
              moisture1DataArr.push({
                time: response_Moisture[0].data[thing].time,
                value: response_Moisture[0].data[thing].value,
              });
              countermoisture1++;
            }
          }
          const reversedmoisture1DataArr = moisture1DataArr.reverse();

          const moisture2DataArr = [];
          let countermoisture2 = 0;
          for (let thing in response_Moisture[0].data) {
            if (countermoisture2 < 100) {
              moisture2DataArr.push({
                time: response_Moisture[0].data[thing].time,
                value: response_Moisture[0].data[thing].value,
              });
              countermoisture2++;
            }
          }
          const reversedmoisture2DataArr = moisture2DataArr.reverse();

          const moisture3DataArr = [];
          let countermoisture3 = 0;
          for (let thing in response_Moisture[0].data) {
            if (countermoisture3 < 100) {
              moisture3DataArr.push({
                time: response_Moisture[0].data[thing].time,
                value: response_Moisture[0].data[thing].value,
              });
              countermoisture3++;
            }
          }
          const reversedmoisture3DataArr = moisture3DataArr.reverse();

          if (isMounted) {
            setmoi1chardata(reversedmoisture1DataArr);
            setmoi2chardata(reversedmoisture2DataArr);
            setmoi3chardata(reversedmoisture3DataArr);
          }
        }
        if (dataset_lux_Chart2Checked) {
          const luxDataArr = [];
          let counterlux = 0;
          for (let thing in response_Lux[0].data) {
            if (counterlux < 100) {
              luxDataArr.push({
                time: response_Lux[0].data[thing].time,
                value: response_Lux[0].data[thing].value,
              });
              counterlux++;
            }
          }
          const reversedluxDataArr = luxDataArr.reverse();

          if (isMounted) {
            setluxchardata(reversedluxDataArr);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        if (isMounted) {
          setIsLoading_chart_2(false);
        }
      }
    };
    const fetchdata_chart_3 = async () => {
      try {
        setIsLoading_chart_3(true);
        const checkboxPromise_Lux = [];
        const checkboxPromise_Humidity = [];
        const checkboxPromise_Temperature = [];
        const checkboxPromise_Moisture = [];
        if (dataset_temperature_Chart3Checked) {
          checkboxPromise_Temperature.push(
            axios.get(`${apiUrl}/api/data/all/temperature?groupId=${groupId}`)
          );
        }
        if (dataset_humidity_Chart3Checked) {
          checkboxPromise_Humidity.push(
            axios.get(`${apiUrl}/api/data/all/humidity?groupId=${groupId}`)
          );
        }
        if (dataset_moisture_Chart3Checked) {
          checkboxPromise_Moisture.push(
            axios.get(`${apiUrl}/api/data/all/moisture/1?groupId=${groupId}`)
          );
          checkboxPromise_Moisture.push(
            axios.get(`${apiUrl}/api/data/all/moisture/2?groupId=${groupId}`)
          );
          checkboxPromise_Moisture.push(
            axios.get(`${apiUrl}/api/data/all/moisture/3?groupId=${groupId}`)
          );
        }
        if (dataset_lux_Chart3Checked) {
          checkboxPromise_Lux.push(
            axios.get(`${apiUrl}/api/data/all/lux?groupId=${groupId}`)
          );
        }
        const response_Moisture = await Promise.all(checkboxPromise_Moisture);
        const response_Humdidity = await Promise.all(checkboxPromise_Humidity);
        const response_Temperature = await Promise.all(
          checkboxPromise_Temperature
        );
        const response_Lux = await Promise.all(checkboxPromise_Lux);
        if (dataset_temperature_Chart3Checked) {
          const temperatureDataArr = [];
          let countertemperature = 0;
          for (let thing in response_Temperature[0].data) {
            if (countertemperature < 100) {
              temperatureDataArr.push({
                time: response_Temperature[0].data[thing].time,
                value: response_Temperature[0].data[thing].value,
              });
              countertemperature++;
            }
          }
          const reversedtemperatureDataArr = temperatureDataArr.reverse();

          if (isMounted) {
            settempchardata(reversedtemperatureDataArr);
          }
        }
        //humidity data
        if (dataset_humidity_Chart3Checked) {
          const humidityDataArr = [];
          let counterhumidity = 0;
          for (let thing in response_Humdidity[0].data) {
            if (counterhumidity < 100) {
              humidityDataArr.push({
                time: response_Humdidity[0].data[thing].time,
                value: response_Humdidity[0].data[thing].value,
              });
              counterhumidity++;
            }
          }
          const reversedhumidityDataArr = humidityDataArr.reverse();

          if (isMounted) {
            sethumchardata(reversedhumidityDataArr);
          }
        }
        //moisture data
        if (dataset_moisture_Chart3Checked) {
          const moisture1DataArr = [];
          let countermoisture1 = 0;
          for (let thing in response_Moisture[0].data) {
            if (countermoisture1 < 100) {
              moisture1DataArr.push({
                time: response_Moisture[0].data[thing].time,
                value: response_Moisture[0].data[thing].value,
              });
              countermoisture1++;
            }
          }
          const reversedmoisture1DataArr = moisture1DataArr.reverse();

          const moisture2DataArr = [];
          let countermoisture2 = 0;
          for (let thing in response_Moisture[0].data) {
            if (countermoisture2 < 100) {
              moisture2DataArr.push({
                time: response_Moisture[0].data[thing].time,
                value: response_Moisture[0].data[thing].value,
              });
              countermoisture2++;
            }
          }
          const reversedmoisture2DataArr = moisture2DataArr.reverse();

          const moisture3DataArr = [];
          let countermoisture3 = 0;
          for (let thing in response_Moisture[0].data) {
            if (countermoisture3 < 100) {
              moisture3DataArr.push({
                time: response_Moisture[0].data[thing].time,
                value: response_Moisture[0].data[thing].value,
              });
              countermoisture3++;
            }
          }
          const reversedmoisture3DataArr = moisture3DataArr.reverse();

          if (isMounted) {
            setmoi1chardata(reversedmoisture1DataArr);
            setmoi2chardata(reversedmoisture2DataArr);
            setmoi3chardata(reversedmoisture3DataArr);
          }
        }
        if (dataset_lux_Chart3Checked) {
          const luxDataArr = [];
          let counterlux = 0;
          for (let thing in response_Lux[0].data) {
            if (counterlux < 100) {
              luxDataArr.push({
                time: response_Lux[0].data[thing].time,
                value: response_Lux[0].data[thing].value,
              });
              counterlux++;
            }
          }
          const reversedluxDataArr = luxDataArr.reverse();

          if (isMounted) {
            setluxchardata(reversedluxDataArr);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        if (isMounted) {
          setIsLoading_chart_3(false);
        }
      }
    };
    const fetchdata_chart_4 = async () => {
      try {
        setIsLoadingchart_4(true);

        const checkboxPromise_Lux = [];
        const checkboxPromise_Humidity = [];
        const checkboxPromise_Temperature = [];
        const checkboxPromise_Moisture = [];

        if (dataset_temperature_Chart4Checked) {
          checkboxPromise_Temperature.push(
            axios.get(`${apiUrl}/api/data/all/temperature?groupId=${groupId}`)
          );
        }
        if (dataset_humidity_Chart4Checked) {
          checkboxPromise_Humidity.push(
            axios.get(`${apiUrl}/api/data/all/humidity?groupId=${groupId}`)
          );
        }
        if (dataset_moisture_Chart4Checked) {
          checkboxPromise_Moisture.push(
            axios.get(`${apiUrl}/api/data/all/moisture/1?groupId=${groupId}`)
          );
          checkboxPromise_Moisture.push(
            axios.get(`${apiUrl}/api/data/all/moisture/2?groupId=${groupId}`)
          );
          checkboxPromise_Moisture.push(
            axios.get(`${apiUrl}/api/data/all/moisture/3?groupId=${groupId}`)
          );
        }
        if (dataset_lux_Chart4Checked) {
          checkboxPromise_Lux.push(
            axios.get(`${apiUrl}/api/data/all/lux?groupId=${groupId}`)
          );
        }

        const response_Moisture = await Promise.all(checkboxPromise_Moisture);
        const response_Humdidity = await Promise.all(checkboxPromise_Humidity);
        const response_Temperature = await Promise.all(
          checkboxPromise_Temperature
        );
        const response_Lux = await Promise.all(checkboxPromise_Lux);
        // Process the responses and update the respective chart data statess

        if (dataset_temperature_Chart4Checked) {
          const temperatureDataArr = [];
          let countertemperature = 0;
          for (let thing in response_Temperature[0].data) {
            if (countertemperature < 100) {
              temperatureDataArr.push({
                time: response_Temperature[0].data[thing].time,
                value: response_Temperature[0].data[thing].value,
              });
              countertemperature++;
            }
          }
          const reversedtemperatureDataArr = temperatureDataArr.reverse();

          if (isMounted) {
            settempchardata(reversedtemperatureDataArr);
          }
        }
        //humidity data
        if (dataset_humidity_Chart4Checked) {
          const humidityDataArr = [];
          let counterhumidity = 0;
          for (let thing in response_Humdidity[0].data) {
            if (counterhumidity < 100) {
              humidityDataArr.push({
                time: response_Humdidity[0].data[thing].time,
                value: response_Humdidity[0].data[thing].value,
              });
              counterhumidity++;
            }
          }
          const reversedhumidityDataArr = humidityDataArr.reverse();

          if (isMounted) {
            sethumchardata(reversedhumidityDataArr);
          }
        }
        //moisture data
        if (dataset_moisture_Chart4Checked) {
          const moisture1DataArr = [];
          let countermoisture1 = 0;
          for (let thing in response_Moisture[0].data) {
            if (countermoisture1 < 100) {
              moisture1DataArr.push({
                time: response_Moisture[0].data[thing].time,
                value: response_Moisture[0].data[thing].value,
              });
              countermoisture1++;
            }
          }
          const reversedmoisture1DataArr = moisture1DataArr.reverse();

          const moisture2DataArr = [];
          let countermoisture2 = 0;
          for (let thing in response_Moisture[0].data) {
            if (countermoisture2 < 100) {
              moisture2DataArr.push({
                time: response_Moisture[0].data[thing].time,
                value: response_Moisture[0].data[thing].value,
              });
              countermoisture2++;
            }
          }
          const reversedmoisture2DataArr = moisture2DataArr.reverse();

          const moisture3DataArr = [];
          let countermoisture3 = 0;
          for (let thing in response_Moisture[0].data) {
            if (countermoisture3 < 100) {
              moisture3DataArr.push({
                time: response_Moisture[0].data[thing].time,
                value: response_Moisture[0].data[thing].value,
              });
              countermoisture3++;
            }
          }
          const reversedmoisture3DataArr = moisture3DataArr.reverse();

          if (isMounted) {
            setmoi1chardata(reversedmoisture1DataArr);
            setmoi2chardata(reversedmoisture2DataArr);
            setmoi3chardata(reversedmoisture3DataArr);
          }
        }
        if (dataset_lux_Chart4Checked) {
          const luxDataArr = [];
          let counterlux = 0;
          for (let thing in response_Lux[0].data) {
            if (counterlux < 100) {
              luxDataArr.push({
                time: response_Lux[0].data[thing].time,
                value: response_Lux[0].data[thing].value,
              });
              counterlux++;
            }
          }
          const reversedluxDataArr = luxDataArr.reverse();

          if (isMounted) {
            setluxchardata(reversedluxDataArr);
          }
        }

        // Similar processing for other responses based on checkbox selection
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        if (isMounted) {
          setIsLoadingchart_4(false);
        }
      }
    };

    if (chart1Checked) {
      fetchdata_chart_1();
    }
    if (chart2Checked) {
      fetchdata_chart_2();
    }
    if (chart3Checked) {
      fetchdata_chart_3();
    }
    if (chart1Checked) {
      fetchdata_chart_4();
    }

    const interval_chart_1 = setInterval(
      fetchdata_chart_1,
      update_interval_value_chart_1
    );

    const interval_chart_2 = setInterval(
      fetchdata_chart_2,
      update_interval_value_chart_2
    );
    const interval_chart_3 = setInterval(
      fetchdata_chart_3,
      update_interval_value_chart_3
    );
    const interval_chart_4 = setInterval(
      fetchdata_chart_4,
      update_interval_value_chart_4
    );
    return () => {
      isMounted = false;
      clearInterval(interval_chart_1);
      clearInterval(interval_chart_2);
      clearInterval(interval_chart_3);
      clearInterval(interval_chart_4);
    };
  }, [
    chart1Checked,
    chart2Checked,
    chart3Checked,
    chart4Checked,

    dataset_temperature_Chart1Checked,
    dataset_humidity_Chart1Checked,
    dataset_moisture_Chart1Checked,
    dataset_lux_Chart1Checked,

    dataset_temperature_Chart2Checked,
    dataset_humidity_Chart2Checked,
    dataset_moisture_Chart2Checked,
    dataset_lux_Chart2Checked,

    dataset_temperature_Chart3Checked,
    dataset_humidity_Chart3Checked,
    dataset_moisture_Chart3Checked,
    dataset_lux_Chart3Checked,

    dataset_temperature_Chart4Checked,
    dataset_humidity_Chart4Checked,
    dataset_moisture_Chart4Checked,
    dataset_lux_Chart4Checked,

    update_interval_value_chart_1,
    update_data_interval_value_chart_1,
    count_chart_1,
  ]);

  const handleChangeChart1 = (event) => {
    setChart1Checked(event.target.checked);
  };

  const handleChangeChart2 = (event) => {
    setChart2Checked(event.target.checked);
  };

  const handleChangeChart3 = (event) => {
    setChart3Checked(event.target.checked);
  };

  const handleChangeChart4 = (event) => {
    setChart4Checked(event.target.checked);
  };

  //chart 1
  const handleChange_dataset_temperature_Chart1 = (event) => {
    setDataset_temperature_Chart1Checked(event.target.checked);
  };
  const handleChange_dataset_humidity_Chart1 = (event) => {
    setDataset_humidity_Chart1Checked(event.target.checked);
  };
  const handleChange_dataset_moisture_Chart1 = (event) => {
    setdataset_moisture_Chart1Checked(event.target.checked);
  };
  const handleChange_dataset_lux_Chart1 = (event) => {
    setdataset_lux_Chart1Checked(event.target.checked);
  };

  //chart 2
  const handleChange_dataset_temperature_Chart2 = (event) => {
    setDataset_temperature_Chart2Checked(event.target.checked);
  };
  const handleChange_dataset_humidity_Chart2 = (event) => {
    setDataset_humidity_Chart2Checked(event.target.checked);
  };
  const handleChange_dataset_moisture_Chart2 = (event) => {
    setdataset_moisture_Chart2Checked(event.target.checked);
  };
  const handleChange_dataset_lux_Chart2 = (event) => {
    setdataset_lux_Chart2Checked(event.target.checked);
  };

  //chart 3
  const handleChange_dataset_temperature_Chart3 = (event) => {
    setDataset_temperature_Chart3Checked(event.target.checked);
  };
  const handleChange_dataset_humidity_Chart3 = (event) => {
    setDataset_humidity_Chart3Checked(event.target.checked);
  };
  const handleChange_dataset_moisture_Chart3 = (event) => {
    setdataset_moisture_Chart3Checked(event.target.checked);
  };
  const handleChange_dataset_lux_Chart3 = (event) => {
    setdataset_lux_Chart3Checked(event.target.checked);
  };

  //chart 4
  const handleChange_dataset_temperature_Chart4 = (event) => {
    setDataset_temperature_Chart4Checked(event.target.checked);
  };
  const handleChange_dataset_humidity_Chart4 = (event) => {
    setDataset_humidity_Chart4Checked(event.target.checked);
  };
  const handleChange_dataset_moisture_Chart4 = (event) => {
    setdataset_moisture_Chart4Checked(event.target.checked);
  };
  const handleChange_dataset_lux_Chart4 = (event) => {
    setdataset_lux_Chart1Checked(event.target.checked);
  };
  const Chart_1 = () => {
    if (chart1Checked === true) {
      return (
        <div>
          <h2 className={styles.heading}>Chart 1</h2>
          <div className={styles.graph}>
            {isLoading_chart_1 ? (
              <div>
                {type_chart_1 === 1 ? (
                  <Line
                    data={{
                      labels: tempchardata.map(
                        (tempchardata) => tempchardata.time
                      ),
                      datasets: [
                        dataset_temperature_Chart1Checked && {
                          label: "tempchardata",
                          data: tempchardata.map(
                            (tempchardata) => tempchardata.value
                          ),
                          borderColor: ["rgba(0, 0, 237, 1)"],
                        },
                        dataset_humidity_Chart1Checked && {
                          label: "humchardata",
                          data: humchardata.map(
                            (humchardata) => humchardata.value
                          ),
                          borderColor: ["rgba(0, 0, 237, 1)"],
                        },
                        dataset_moisture_Chart1Checked && {
                          label: "moisturedata",
                          data: moi1chardata.map(
                            (moi1chardata) => moi1chardata.value
                          ),
                          borderColor: ["rgba(0, 0, 237, 1)"],
                        },
                        dataset_lux_Chart1Checked && {
                          label: "luxchardata",
                          data: luxchardata.map(
                            (luxchardata) => luxchardata.value
                          ),
                          borderColor: ["rgba(0, 0, 237, 1)"],
                        },
                      ].filter(Boolean),
                    }}
                    options={{
                      animation: false,
                      pointRadius: 0,
                      interaction: {
                        intersect: false,
                        mode: "index",
                      },
                      tooltips: {
                        enabled: true, // enable tooltips
                        callbacks: {
                          // customize tooltip content
                          label: (context) => {
                            const datasetLabel = context.dataset.label || "";
                            const value = context.parsed.y;
                            return `${datasetLabel}: ${value}`;
                          },
                        },
                      },
                      scales: {
                        x: {
                          type: "time",
                          time: {
                            displayFormats: {
                              hour: "HH:MM",
                            },
                          },
                          ticks: {
                            source: "auto",
                            // Disabled rotation for performance
                            maxRotation: 0,
                            autoSkip: true,
                            reverse: true,
                          },
                        },
                      },
                    }}
                    className={styles.chart}
                  />
                ) : type_chart_1 === 2 ? (
                  <Scatter
                    data={{
                      labels: tempchardata.map(
                        (tempchardata) => tempchardata.time
                      ),
                      datasets: [
                        dataset_temperature_Chart1Checked && {
                          label: "tempchardata",
                          data: tempchardata.map(
                            (tempchardata) => tempchardata.value
                          ),
                          borderColor: ["rgba(0, 0, 237, 1)"],
                        },
                        dataset_humidity_Chart1Checked && {
                          label: "humchardata",
                          data: humchardata.map(
                            (humchardata) => humchardata.value
                          ),
                          borderColor: ["rgba(0, 0, 237, 1)"],
                        },
                        dataset_moisture_Chart1Checked && {
                          label: "moisturedata",
                          data: moi1chardata.map(
                            (moi1chardata) => moi1chardata.value
                          ),
                          borderColor: ["rgba(0, 0, 237, 1)"],
                        },
                        dataset_lux_Chart1Checked && {
                          label: "luxchardata",
                          data: luxchardata.map(
                            (luxchardata) => luxchardata.value
                          ),
                          borderColor: ["rgba(0, 0, 237, 1)"],
                        },
                      ].filter(Boolean),
                    }}
                    options={{
                      animation: false,
                      pointRadius: 5,
                      interaction: {
                        intersect: false,
                        mode: "index",
                      },
                      tooltips: {
                        enabled: true, // enable tooltips
                        callbacks: {
                          // customize tooltip content
                          label: (context) => {
                            const datasetLabel = context.dataset.label || "";
                            const value = context.parsed.y;
                            return `${datasetLabel}: ${value}`;
                          },
                        },
                      },
                      scales: {
                        x: {
                          type: "time",
                          time: {
                            displayFormats: {
                              hour: "HH:MM",
                            },
                          },
                          ticks: {
                            source: "auto",
                            // Disabled rotation for performance
                            maxRotation: 0,
                            autoSkip: true,
                            reverse: true,
                          },
                        },
                      },
                    }}
                    className={styles.chart}
                  />
                ) : (
                  <div>
                    <h1>error</h1>
                  </div>
                )}

                <div>
                  <button
                    onClick={openEditPopup_1}
                    className={styles.edit_popup}
                  >
                    Edit Dataset
                  </button>
                  <button onClick={addFilter_1} className={styles.edit_popup}>
                    .Add Filter.
                  </button>
                  <button
                    onClick={openTypePopup_1}
                    className={styles.edit_popup}
                  >
                    change type
                  </button>
                  <button
                    onClick={openCountPopup_1}
                    className={styles.edit_popup}
                  >
                    max count
                  </button>
                  <button
                    onClick={openDataPopup_1}
                    className={styles.edit_popup}
                  >
                    data interval
                  </button>
                  <button onClick={live_data_1} className={styles.edit_popup}>
                    live data
                  </button>
                  <button
                    onClick={openIntervalPopup_1}
                    className={styles.edit_popup}
                  >
                    update interval
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.loading}>
                <ClipLoader size={50} className={styles.heading} />
              </div>
            )}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const Chart_2 = () => {
    if (chart2Checked === true) {
      return (
        <div>
          <h2 className={styles.heading}>Chart 2</h2>
          <div className={styles.graph}>
            {!isLoading_chart_2 ? (
              <div>
                <Line
                  data={{
                    labels: tempchardata.map(
                      (tempchardata) => tempchardata.time
                    ),
                    datasets: [
                      dataset_temperature_Chart2Checked && {
                        label: "tempchardata",
                        data: tempchardata.map(
                          (tempchardata) => tempchardata.value
                        ),
                        borderColor: ["rgba(0, 0, 237, 1)"],
                      },
                      dataset_humidity_Chart2Checked && {
                        label: "humchardata",
                        data: humchardata.map(
                          (humchardata) => humchardata.value
                        ),
                        borderColor: ["rgba(0, 0, 237, 1)"],
                      },
                      dataset_moisture_Chart2Checked && {
                        label: "moisturedata",
                        data: moi1chardata.map(
                          (moi1chardata) => moi1chardata.value
                        ),
                        borderColor: ["rgba(0, 0, 237, 1)"],
                      },
                      dataset_lux_Chart2Checked && {
                        label: "luxchardata",
                        data: luxchardata.map(
                          (luxchardata) => luxchardata.value
                        ),
                        borderColor: ["rgba(0, 0, 237, 1)"],
                      },
                    ].filter(Boolean),
                  }}
                  options={{
                    scales: {
                      x: {
                        type: "time",
                        time: {
                          displayFormats: {
                            hour: "HH:MM",
                          },
                        },
                        ticks: {
                          autoSkip: true,
                        },
                      },
                    },
                  }}
                />
                <div>
                  <button
                    onClick={openEditPopup_2}
                    className={styles.edit_popup}
                  >
                    Add Dataset
                  </button>
                  <button onClick={addFilter_2} className={styles.edit_popup}>
                    Add Filter
                  </button>
                  <button onClick={change_type_2} className={styles.edit_popup}>
                    change type
                  </button>
                  <button
                    onClick={max_count_values_2}
                    className={styles.edit_popup}
                  >
                    max count
                  </button>
                  <button
                    onClick={data_interval_2}
                    className={styles.edit_popup}
                  >
                    data interval
                  </button>
                  <button onClick={live_data_2} className={styles.edit_popup}>
                    .live data.
                  </button>
                  <button
                    onClick={openIntervalPopup_2}
                    className={styles.edit_popup}
                  >
                    update interval
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.loading}>
                <ClipLoader size={50} className={styles.heading} />
              </div>
            )}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const Chart_3 = () => {
    if (chart3Checked === true) {
      return (
        <div>
          <h2 className={styles.heading}>Chart 3</h2>
          <div className={styles.graph}>
            {!isLoading_chart_3 ? (
              <div>
                <Line
                  data={{
                    labels: tempchardata.map(
                      (tempchardata) => tempchardata.time
                    ),
                    datasets: [
                      dataset_temperature_Chart3Checked && {
                        label: "tempchardata",
                        data: tempchardata.map(
                          (tempchardata) => tempchardata.value
                        ),
                        borderColor: ["rgba(0, 0, 237, 1)"],
                      },
                      dataset_humidity_Chart3Checked && {
                        label: "humchardata",
                        data: humchardata.map(
                          (humchardata) => humchardata.value
                        ),
                        borderColor: ["rgba(0, 0, 237, 1)"],
                      },
                      dataset_moisture_Chart3Checked && {
                        label: "moisturedata",
                        data: moi1chardata.map(
                          (moi1chardata) => moi1chardata.value
                        ),
                        borderColor: ["rgba(0, 0, 237, 1)"],
                      },
                      dataset_lux_Chart3Checked && {
                        label: "luxchardata",
                        data: luxchardata.map(
                          (luxchardata) => luxchardata.value
                        ),
                        borderColor: ["rgba(0, 0, 237, 1)"],
                      },
                    ].filter(Boolean),
                  }}
                  options={{
                    animation: false,
                    pointRadius: 0,
                    scales: {
                      x: {
                        type: "time",
                        time: {
                          displayFormats: {
                            hour: "HH:MM",
                          },
                        },
                        ticks: {
                          source: "auto",
                          // Disabled rotation for performance
                          maxRotation: 0,
                          autoSkip: true,
                          reverse: true,
                        },
                      },
                    },
                  }}
                  className={styles.chart}
                />
                <div>
                  <button
                    onClick={openEditPopup_3}
                    className={styles.edit_popup}
                  >
                    Add Dataset
                  </button>
                  <button onClick={addFilter_3} className={styles.edit_popup}>
                    Add Filter
                  </button>
                  <button onClick={change_type_3} className={styles.edit_popup}>
                    change type
                  </button>
                  <button
                    onClick={max_count_values_3}
                    className={styles.edit_popup}
                  >
                    max count
                  </button>
                  <button
                    onClick={data_interval_3}
                    className={styles.edit_popup}
                  >
                    data interval
                  </button>
                  <button onClick={live_data_3} className={styles.edit_popup}>
                    live data
                  </button>
                  <button
                    onClick={openIntervalPopup_3}
                    className={styles.edit_popup}
                  >
                    update interval
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.loading}>
                <ClipLoader size={50} className={styles.heading} />
              </div>
            )}
          </div>
        </div>
      );
    }
  };
  const Chart_4 = () => {
    if (chart4Checked === true) {
      return (
        <div>
          <h2 className={styles.heading}>Chart 4 </h2>
          <div className={styles.graph}>
            {!isLoading_chart_4 ? (
              <div>
                <Line
                  data={{
                    labels: tempchardata.map(
                      (tempchardata) => tempchardata.time
                    ),
                    datasets: [
                      dataset_temperature_Chart4Checked && {
                        label: "tempchardata",
                        data: tempchardata.map(
                          (tempchardata) => tempchardata.value
                        ),
                        borderColor: ["rgba(0, 0, 237, 1)"],
                      },
                      dataset_humidity_Chart4Checked && {
                        label: "humchardata",
                        data: humchardata.map(
                          (humchardata) => humchardata.value
                        ),
                        borderColor: ["rgba(0, 0, 237, 1)"],
                      },
                      dataset_moisture_Chart4Checked && {
                        label: "moisturedata",
                        data: moi1chardata.map(
                          (moi1chardata) => moi1chardata.value
                        ),
                        borderColor: ["rgba(0, 0, 237, 1)"],
                      },
                      dataset_lux_Chart4Checked && {
                        label: "luxchardata",
                        data: luxchardata.map(
                          (luxchardata) => luxchardata.value
                        ),
                        borderColor: ["rgba(0, 0, 237, 1)"],
                      },
                    ].filter(Boolean),
                  }}
                  options={{
                    animation: false,
                    pointRadius: 0,
                    scales: {
                      x: {
                        type: "time",
                        time: {
                          displayFormats: {
                            hour: "HH:MM",
                          },
                        },
                        ticks: {
                          source: "auto",
                          // Disabled rotation for performance
                          maxRotation: 0,
                          autoSkip: true,
                          reverse: true,
                        },
                      },
                    },
                  }}
                  className={styles.chart}
                />{" "}
                <div>
                  <button
                    onClick={openEditPopup_4}
                    className={styles.edit_popup}
                  >
                    Add Dataset
                  </button>
                  <button onClick={addFilter_4} className={styles.edit_popup}>
                    Add Filter
                  </button>
                  <button onClick={change_type_4} className={styles.edit_popup}>
                    change type
                  </button>
                  <button
                    onClick={max_count_values_4}
                    className={styles.edit_popup}
                  >
                    max count
                  </button>
                  <button
                    onClick={data_interval_4}
                    className={styles.edit_popup}
                  >
                    data interval
                  </button>
                  <button onClick={live_data_4} className={styles.edit_popup}>
                    live data
                  </button>
                  <button
                    onClick={openIntervalPopup_4}
                    className={styles.edit_popup}
                  >
                    update interval
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.loading}>
                <ClipLoader size={50} className={styles.heading} />
              </div>
            )}
          </div>
        </div>
      );
    }
  };
  return (
    <>
      <div>
        <h1 className={styles.heading}>History</h1>
        <div>
          <div className={styles.diagramm}>
            {Chart_1()}
            {Chart_2()}
            {Chart_3()}
            {Chart_4()}
          </div>
          <button onClick={edit_chart_number} className={styles.edit_popup}>
            edit chart number
          </button>
          {isPopupOpen && (
            <div className={styles.popup}>
              <div className={styles.popupContent}>
                <h3>Add Chart Popup</h3>
                <div className={styles.checkbox}>
                  <form>
                    <input
                      type="checkbox"
                      name="chart1"
                      checked={chart1Checked}
                      onChange={handleChangeChart1}
                    />
                    <label htmlFor="chart1">Chart 1</label>

                    <input
                      type="checkbox"
                      name="chart2"
                      checked={chart2Checked}
                      onChange={handleChangeChart2}
                    />
                    <label htmlFor="chart2">Chart 2</label>

                    <input
                      type="checkbox"
                      name="chart3"
                      checked={chart3Checked}
                      onChange={handleChangeChart3}
                    />
                    <label htmlFor="chart3">Chart 3</label>

                    <input
                      type="checkbox"
                      name="chart4"
                      checked={chart4Checked}
                      onChange={handleChangeChart4}
                    />
                    <label htmlFor="chart4">Chart 4</label>

                    <br></br>
                  </form>
                </div>
                <button onClick={closePopup} className={styles.edit_popup}>
                  Close
                </button>
              </div>
            </div>
          )}
          {IsEditPopupOpen_1 && (
            <div className={styles.popup}>
              <div className={styles.popupContent}>
                <h3>Choose your Datasets for Chart 1</h3>
                <div className={styles.checkbox}>
                  <form>
                    <input
                      type="checkbox"
                      name="Temperature"
                      checked={dataset_temperature_Chart1Checked}
                      onChange={handleChange_dataset_temperature_Chart1}
                    />
                    <label htmlFor="Temperature">Temperature</label>

                    <input
                      type="checkbox"
                      name="Humidity"
                      checked={dataset_humidity_Chart1Checked}
                      onChange={handleChange_dataset_humidity_Chart1}
                    />
                    <label htmlFor="Humidity">Humidity</label>

                    <input
                      type="checkbox"
                      name="Moisture"
                      checked={dataset_moisture_Chart1Checked}
                      onChange={handleChange_dataset_moisture_Chart1}
                    />
                    <label htmlFor="Moisture">Moisture</label>

                    <input
                      type="checkbox"
                      name="lux"
                      checked={dataset_lux_Chart1Checked}
                      onChange={handleChange_dataset_lux_Chart1}
                    />
                    <label htmlFor="Lux_1">lux</label>

                    <br></br>
                  </form>
                </div>
                <button
                  onClick={closeEditPopup_1}
                  className={styles.edit_popup}
                >
                  Close
                </button>
              </div>
            </div>
          )}
          {IsEditPopupOpen_2 && (
            <div className={styles.popup}>
              <div className={styles.popupContent}>
                <h3>Choose your Datasets for Chart 2</h3>
                <div className={styles.checkbox}>
                  <form>
                    <input
                      type="checkbox"
                      name="Temperature"
                      checked={dataset_temperature_Chart2Checked}
                      onChange={handleChange_dataset_temperature_Chart2}
                    />
                    <label htmlFor="Temperature">Temperature</label>

                    <input
                      type="checkbox"
                      name="Humidity"
                      checked={dataset_humidity_Chart2Checked}
                      onChange={handleChange_dataset_humidity_Chart2}
                    />
                    <label htmlFor="Temperature">Humidity</label>

                    <input
                      type="checkbox"
                      name="Moisture"
                      checked={dataset_moisture_Chart2Checked}
                      onChange={handleChange_dataset_moisture_Chart2}
                    />
                    <label htmlFor="Moisture">Moisture</label>

                    <input
                      type="checkbox"
                      name="lux"
                      checked={dataset_lux_Chart2Checked}
                      onChange={handleChange_dataset_lux_Chart2}
                    />
                    <label htmlFor="Lux_2">lux</label>

                    <br></br>
                  </form>
                </div>
                <button
                  onClick={closeEditPopup_2}
                  className={styles.edit_popup}
                >
                  Close
                </button>
              </div>
            </div>
          )}
          {IsEditPopupOpen_3 && (
            <div className={styles.popup}>
              <div className={styles.popupContent}>
                <h3>Choose your Datasets for Chart 3</h3>
                <div className={styles.checkbox}>
                  <form>
                    <input
                      type="checkbox"
                      name="Temperature"
                      checked={dataset_temperature_Chart3Checked}
                      onChange={handleChange_dataset_temperature_Chart3}
                    />
                    <label htmlFor="Temperature">Temperature</label>

                    <input
                      type="checkbox"
                      name="Humidity"
                      checked={dataset_humidity_Chart3Checked}
                      onChange={handleChange_dataset_humidity_Chart3}
                    />
                    <label htmlFor="Humidity">Humidity</label>

                    <input
                      type="checkbox"
                      name="Moisture"
                      checked={dataset_moisture_Chart3Checked}
                      onChange={handleChange_dataset_moisture_Chart3}
                    />
                    <label htmlFor="Moisture">Moisture</label>

                    <input
                      type="checkbox"
                      name="lux"
                      checked={dataset_lux_Chart3Checked}
                      onChange={handleChange_dataset_lux_Chart3}
                    />
                    <label htmlFor="Lux_3">lux</label>

                    <br></br>
                  </form>
                </div>
                <button
                  onClick={closeEditPopup_3}
                  className={styles.edit_popup}
                >
                  Close
                </button>
              </div>
            </div>
          )}
          {IsEditPopupOpen_4 && (
            <div className={styles.popup}>
              <div className={styles.popupContent}>
                <h3>Choose your Datasets for Chart 4</h3>
                <div className={styles.checkbox}>
                  <form>
                    <input
                      type="checkbox"
                      name="Temperature"
                      checked={dataset_temperature_Chart4Checked}
                      onChange={handleChange_dataset_temperature_Chart4}
                    />
                    <label htmlFor="Temperature_4">Temperature</label>

                    <input
                      type="checkbox"
                      name="Humidity"
                      checked={dataset_humidity_Chart4Checked}
                      onChange={handleChange_dataset_humidity_Chart4}
                    />
                    <label htmlFor="Humidity_4">Humidity</label>

                    <input
                      type="checkbox"
                      name="chart4"
                      checked={dataset_moisture_Chart4Checked}
                      onChange={handleChange_dataset_moisture_Chart4}
                    />
                    <label htmlFor="Moisture_4">Moisture</label>

                    <input
                      type="checkbox"
                      name="lux"
                      checked={dataset_lux_Chart4Checked}
                      onChange={handleChange_dataset_lux_Chart4}
                    />
                    <label htmlFor="Lux_4">lux</label>

                    <br></br>
                  </form>
                </div>
                <button
                  onClick={closeEditPopup_4}
                  className={styles.edit_popup}
                >
                  Close
                </button>
              </div>
            </div>
          )}
          {IsDataPopupOpen_1 && (
            <div className={styles.popup}>
              <div className={styles.popupContent}>
                <h3>Select your data Interval</h3>
                <label htmlFor="updateInterval_chart_1">Data Interval: </label>
                <select
                  id="updateInterval_chart_1"
                  value={update_interval_value_chart_1}
                  onChange={handleDataIntervalChange_chart_1}
                >
                  <option value={100}>Live</option>
                  <option value={60000}>1 minutes</option>
                  <option value={600000}>10 minutes</option>
                  <option value={900000}>15 minutes</option>
                  <option value={1800000}>30 minutes</option>
                  <option value={2700000}>45 minutes</option>
                  <option value={3600000}>1 hour</option>
                </select>
                <div className={styles.checkbox}></div>
                <button
                  onClick={closeDataPopup_1}
                  className={styles.edit_popup}
                >
                  Close
                </button>
              </div>
            </div>
          )}
          {IsCountPopupOpen_1 && (
            <div className={styles.popup}>
              <div className={styles.popupContent}>
                <h3>Select your max count of data points</h3>
                <label htmlFor="updateInterval_chart_1">Data Interval: </label>
                <select
                  id="updateInterval_chart_1"
                  value={count_chart_1}
                  onChange={handleCountChange_chart_1}
                >
                  <option value={100}>100</option>
                  <option value={500}>500</option>
                  <option value={1000}>1000</option>
                  <option value={2000}>2000</option>
                  <option value={3000}>3000</option>
                  <option value={4000}>4000</option>
                </select>
                <div className={styles.checkbox}></div>
                <button
                  onClick={closeCountPopup_1}
                  className={styles.edit_popup}
                >
                  Close
                </button>
              </div>
            </div>
          )}
          {IsTypePopupOpen_1 && (
            <div className={styles.popup}>
              <div className={styles.popupContent}>
                <h3>Select yourtype of chart</h3>
                <label htmlFor="updateInterval_chart_1">Type </label>
                <select
                  id="updateInterval_chart_1"
                  value={count_chart_1}
                  onChange={handleTypeChange_chart_1}
                >
                  <option value={1}>line</option>
                  <option value={2}>scatter</option>
                </select>
                <div className={styles.checkbox}></div>
                <button
                  onClick={closeTypePopup_1}
                  className={styles.edit_popup}
                >
                  Close
                </button>
              </div>
            </div>
          )}
          {IsIntervalPopupOpen_1 && (
            <div className={styles.popup}>
              <div className={styles.popupContent}>
                <h3>Choose your Datasets for Chart 4</h3>
                <label htmlFor="updateInterval_chart_1">
                  Update Interval:{" "}
                </label>
                <select
                  id="updateInterval_chart_1"
                  value={update_interval_value_chart_1}
                  onChange={handleIntervalChange_chart_1}
                >
                  <option value={100}>Live</option>
                  <option value={5000}>5 seconds</option>
                  <option value={10000}>10 seconds</option>
                  <option value={15000}>15 seconds</option>
                </select>
                <div className={styles.checkbox}></div>
                <button
                  onClick={closeIntervalPopup_1}
                  className={styles.edit_popup}
                >
                  Close
                </button>
              </div>
            </div>
          )}
          {IsIntervalPopupOpen_2 && (
            <div className={styles.popup}>
              <div className={styles.popupContent}>
                <h3>Choose your Datasets for Chart 4</h3>
                <div className={styles.checkbox}></div>
                <button
                  onClick={closeIntervalPopup_2}
                  className={styles.edit_popup}
                >
                  Close
                </button>
              </div>
            </div>
          )}
          {IsIntervalPopupOpen_3 && (
            <div className={styles.popup}>
              <div className={styles.popupContent}>
                <h3>Choose your Datasets for Chart 4</h3>
                <div className={styles.checkbox}></div>
                <button
                  onClick={closeIntervalPopup_3}
                  className={styles.edit_popup}
                >
                  Close
                </button>
              </div>
            </div>
          )}
          {IsIntervalPopupOpen_4 && (
            <div className={styles.popup}>
              <div className={styles.popupContent}>
                <h3>Choose your Datasets for Chart 4</h3>
                <div className={styles.checkbox}></div>
                <button
                  onClick={closeIntervalPopup_4}
                  className={styles.edit_popup}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default History;
