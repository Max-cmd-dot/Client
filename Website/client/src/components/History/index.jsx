<<<<<<< Updated upstream
import React, { useState } from "react";
import ChartComponent from "../Chart/chart.jsx"; // Import the chart component
import styles from "./styles.module.css";
import ButtonGroup from "../ButtonGroup/button-group.jsx"; // Import the ButtonGroup component

const History = () => {
  // Define your buttons for the ButtonGroup
  const [buttons, setButtons] = useState([
    "Chart 1",
    "Chart 2",
    "Chart 3",
    "+",
  ]);

  const [which_chart, setWhichChart] = useState("Chart 1"); // Initialize which_chart with the label of the first button

  const doSomethingAfterClick = (event) => {
=======
import React, { useState, useEffect } from "react";
import ChartComponent from "../Chart/chart.jsx"; // Import the chart component
import styles from "./styles.module.css";
import ButtonGroup from "../ButtonGroup/button-group.jsx"; // Import the ButtonGroup component
const apiUrl = process.env.REACT_APP_API_URL;

const History = () => {
  const [buttons, setButtons] = useState(["+"]);
  const [which_chart, setWhichChart] = useState(null);

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
>>>>>>> Stashed changes
    if (event.target.name === "+") {
      let i = 1;
      while (buttons.includes("Chart " + i)) {
        i++;
      }
<<<<<<< Updated upstream
      const newButtons = [...buttons.slice(0, -1), "Chart " + i, "+"].sort(
        (a, b) => {
          if (a === "+" || isNaN(a.split(" ")[1])) return 1;
          if (b === "+" || isNaN(b.split(" ")[1])) return -1;
          return a.split(" ")[1] - b.split(" ")[1];
        }
      );
      setButtons(newButtons);
      setWhichChart("Chart " + i); // Set which_chart to the newly created chart
    } else if (event.target.name === "Delete this chart") {
=======
      const newChartName = "Chart " + i;
      await addChart(userId, newChartName);
      const newButtons = [...buttons.slice(0, -1), newChartName, "+"];
      setButtons(newButtons);
      setWhichChart(newChartName);
    } else if (event.target.name === "Delete this chart") {
      await deleteChart(userId, which_chart);
>>>>>>> Stashed changes
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
    } else {
      setWhichChart(event.target.name); // Save the clicked button's label to which_chart
<<<<<<< Updated upstream
      console.log(which_chart + " is selected");
    }
  };

=======
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("id");
    getAllCharts(userId).then((charts) => {
      const sortedCharts = charts.sort((a, b) => a.localeCompare(b));
      setButtons([...sortedCharts, "+"]);
      setWhichChart(sortedCharts[0]);
    });
  }, []);
>>>>>>> Stashed changes
  return (
    <>
      <div>
        <h1 className={styles.heading}>History</h1>
        <div className={styles.buttonContainer}>
          <ButtonGroup
<<<<<<< Updated upstream
            buttons={buttons}
=======
            buttons={buttons.sort((a, b) => {
              if (a === "+") return 1;
              if (b === "+") return -1;
              return a.localeCompare(b);
            })}
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                    <button
                      name="Delete this chart"
                      onClick={doSomethingAfterClick}
                      style={{ position: "absolute", right: "0", bottom: "0" }}
                    >
                      Delete this chart
                    </button>
=======
>>>>>>> Stashed changes
                  </>
                )}
              </div>
            )
        )}
<<<<<<< Updated upstream
=======
        <button
          name="Delete this chart"
          onClick={doSomethingAfterClick}
          className={styles.delete_button}
        >
          Delete this chart window
        </button>
>>>>>>> Stashed changes
      </div>
    </>
  );
};

export default History;
