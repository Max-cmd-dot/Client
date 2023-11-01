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
    if (event.target.name === "+") {
      let i = 1;
      while (buttons.includes("Chart " + i)) {
        i++;
      }
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
      console.log(which_chart + " is selected");
    }
  };

  return (
    <>
      <div>
        <h1 className={styles.heading}>History</h1>
        <div className={styles.buttonContainer}>
          <ButtonGroup
            buttons={buttons}
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
                    <button
                      name="Delete this chart"
                      onClick={doSomethingAfterClick}
                      style={{ position: "absolute", right: "0", bottom: "0" }}
                    >
                      Delete this chart
                    </button>
                  </>
                )}
              </div>
            )
        )}
      </div>
    </>
  );
};

export default History;
