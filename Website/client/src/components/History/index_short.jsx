import React, { useState } from "react";
import ChartComponent from "../Chart/chart.jsx";
import styles from "./styles.module.css";

const History = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [charts, setCharts] = useState([true, true, true, true]); // Initialize with 4 charts

  const edit_chart_number = () => {
    openPopup();
  };

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleChangeChart = (index) => (event) => {
    let newCharts = [...charts];
    newCharts[index] = event.target.checked;
    setCharts(newCharts);
  };

  const addChart = () => {
    setCharts([...charts, false]);
  };

  return (
    <>
      <div>
        <h1 className={styles.heading}>History</h1>
        {charts.map(
          (chartChecked, index) =>
            chartChecked && <ChartComponent key={index} />
        )}
        <button onClick={edit_chart_number} className="edit_popup">
          edit chart number
        </button>
        {isPopupOpen && (
          <div className="popup">
            <div className="popupContent">
              <h2>Standard</h2>
              {charts.slice(0, 4).map((chartChecked, index) => (
                <div key={index}>
                  <input
                    type="checkbox"
                    name={`chart${index}`}
                    checked={chartChecked}
                    onChange={handleChangeChart(index)}
                  />
                  <label htmlFor={`chart${index}`}>Chart {index + 1}</label>
                  <br></br>
                </div>
              ))}
              <h2>Custom</h2>
              {charts.slice(4).map((chartChecked, index) => (
                <div key={index + 4}>
                  <input
                    type="checkbox"
                    name={`chart${index + 4}`}
                    checked={chartChecked}
                    onChange={handleChangeChart(index + 4)}
                  />
                  <label htmlFor={`chart${index + 4}`}>Chart {index + 5}</label>
                  <br></br>
                </div>
              ))}
              <button onClick={addChart}>+</button>
              <br></br>
              <button onClick={closePopup} className="edit_popup">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default History;
