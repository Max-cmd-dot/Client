import React, { useState } from "react";
import "./button-group.css";

const ButtonGroup = ({
  buttons,
  doSomethingAfterClick,
  defaultActiveButton,
  overrideBoxColor,
  overrideButtonColor,
  buttonSize,
  buttonWidth,
  buttonHeight,
}) => {
  const [clickedId, setClickedId] = useState(defaultActiveButton);

  const handleClick = (event, id) => {
    setClickedId(id);
    doSomethingAfterClick(event);
  };

  return (
    <>
      <div
        className={`box-container ${
          overrideBoxColor ? "override-box-color" : ""
        }`}
      >
        {buttons.map((buttonLabel, i) => (
          <button
            key={i}
            name={buttonLabel}
            onClick={(event) => handleClick(event, i)}
            className={`${
              i === clickedId ? "customButton activeButton" : "customButton"
            } ${overrideButtonColor ? "override_button_color" : ""}`}
            style={{
              fontSize: buttonSize,
              width: buttonWidth,
              height: buttonHeight,
            }}
          >
            {buttonLabel}
          </button>
        ))}
      </div>
    </>
  );
};

export default ButtonGroup;
