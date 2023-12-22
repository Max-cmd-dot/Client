import React from "react";
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
  activeButton,
  disabled,
}) => {
  const handleClick = (event, id) => {
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
              (typeof activeButton === "string" ? buttonLabel : i) ===
              activeButton
                ? "customButton activeButton"
                : "customButton"
            } ${overrideButtonColor ? "override_button_color" : ""}${
              disabled ? "disabled" : "" // Add this line
            }`}
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
