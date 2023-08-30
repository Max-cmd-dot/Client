import React, { useState } from "react";
import "./button-group.css";

const ButtonGroup = ({
  buttons,
  doSomethingAfterClick,
  defaultActiveButton,
}) => {
  const [clickedId, setClickedId] = useState(defaultActiveButton);

  const handleClick = (event, id) => {
    setClickedId(id);
    doSomethingAfterClick(event);
  };

  return (
    <>
      {buttons.map((buttonLabel, i) => (
        <button
          key={i}
          name={buttonLabel}
          onClick={(event) => handleClick(event, i)}
          className={
            i === clickedId ? "customButton activeButton" : "customButton"
          }
        >
          {buttonLabel}
        </button>
      ))}
    </>
  );
};

export default ButtonGroup;
