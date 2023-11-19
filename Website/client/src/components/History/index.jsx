import React, { useState, useEffect } from "react";
import ChartComponent from "../Chart/chart.jsx"; // Import the chart component
import styles from "./styles.module.css";
import ButtonGroup from "../ButtonGroup/button-group.jsx"; // Import the ButtonGroup component
const apiUrl = process.env.REACT_APP_API_URL;
import { changeRoute } from "../../reduxStore";
import { useSelector, useDispatch } from "react-redux";

// This function fetches all of the charts that the user has saved in their history
const getAllCharts = async (userId) => {
  const response = await fetch(`${apiUrl}/api/historyChart/all/${userId}`);
  const data = await response.json();
  return data.charts.map((chart) => chart.chartName);
};

// This function adds a new chart to the user's history
const addChart = async (userId, chartName) => {
  const response = await fetch(`${apiUrl}/api/historyChart/update/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ chartName }),
  });
  const data = await response.json();
  return data;
};

// This function deletes a chart from the user's history
const deleteChart = async (userId, chartName) => {
  const response = await fetch(
    `${apiUrl}/api/historyChart/delete/${userId}/${chartName}`,
    {
      method: "DELETE",
    }
  );
  console.log("deleted chart");
  const data = await response.json();
  return data;
};

const History = () => {
  const [buttons, setButtons] = useState(["+"]);
  const [which_chart, setWhichChart] = useState(null);
  const dispatch = useDispatch();
  // Use another effect hook to dispatch changeRoute when the component mounts
  useEffect(() => {
    dispatch(changeRoute("/"));
  }, [dispatch]); // Re-run the effect if dispatch changes

  const getAllCharts = async (userId) => {
    const response = await fetch(`${apiUrl}/api/historyChart/all/${userId}`);
    const data = await response.json();
    return data.charts.map((chart) => chart.chartName);
  };

  const addChart = async (userId, chartName) => {
    const response = await fetch(
      `${apiUrl}/api/historyChart/update/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chartName }),
      }
    );
    const data = await response.json();
    return data;
  };

  const deleteChart = async (userId, chartName) => {
    const response = await fetch(
      `${apiUrl}/api/historyChart/delete/${userId}/${chartName}`,
      {
        method: "DELETE",
      }
    );
    console.log("deleted chart");
    const data = await response.json();
    return data;
  };

  const doSomethingAfterClick = async (event) => {
    const userId = localStorage.getItem("id");
    if (event.target.name === "+") {
      let i = 1;
      while (buttons.includes("Chart " + i)) {
        i++;
      }
      const newChartName = "Chart " + i;
      await addChart(userId, newChartName);
      const newButtons = [...buttons.slice(0, -1), newChartName, "+"];
      setButtons(newButtons);
      setWhichChart(newChartName);
      console.log("doSomethingAfterClick: newButtons = ", newButtons);
      console.log("doSomethingAfterClick: newChartName = ", newChartName);
    } else if (event.target.name === "Delete this chart") {
      await deleteChart(userId, which_chart);
      const newButtons = buttons.filter((button) => button !== which_chart);
      if (!newButtons.some((button) => button.startsWith("Chart"))) {
        let i = 1;
        while (newButtons.includes("Chart " + i)) {
          i++;
        }
        newButtons.splice(newButtons.length - 1, 0, "Chart " + i);
      }
      setButtons(newButtons);
      setWhichChart(newButtons.find((button) => button.startsWith("Chart"))); // Set which_chart to the first remaining chart
      console.log("doSomethingAfterClick: newButtons = ", newButtons);
      console.log("doSomethingAfterClick: which_chart = ", which_chart);
    } else {
      setWhichChart(event.target.name); // Save the clicked button's label to which_chart
      console.log("doSomethingAfterClick: which_chart = ", which_chart);
    }
  };
  useEffect(() => {
    const userId = localStorage.getItem("id");
    getAllCharts(userId).then((charts) => {
      const sortedCharts = charts.sort((a, b) => a.localeCompare(b));
      setButtons([...sortedCharts, "+"]);
      setWhichChart(sortedCharts[0]);
      console.log("useEffect: sortedCharts = ", sortedCharts);
    });
  }, []);
  return (
    <>
      <div>
        <h1 className={styles.heading}>History</h1>
        <div className={styles.buttonContainer}>
          <ButtonGroup
            buttons={buttons.sort((a, b) => {
              if (a === "+") return 1;
              if (b === "+") return -1;
              return a.localeCompare(b);
            })}
            doSomethingAfterClick={doSomethingAfterClick}
            defaultActiveButton={0}
            activeButton={which_chart} // Pass which_chart as a prop
          />
        </div>
        {buttons.map(
          (button, index) =>
            button !== "+" && (
              <div key={index}>
                {which_chart === button && (
                  <>
                    <ChartComponent chartName={which_chart} />
                  </>
                )}
              </div>
            )
        )}
        <button
          name="Delete this chart"
          onClick={doSomethingAfterClick}
          className={styles.delete_button}
        >
          Delete this chart window
        </button>
      </div>
    </>
  );
};

export default History;
