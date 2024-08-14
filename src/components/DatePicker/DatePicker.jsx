import React, { useState } from "react";
import "./DatePicker.css"; // assuming DatePicker.css is in the same directory

const DatePicker = () => {
  const [date, setDate] = useState(new Date());

  const incrementDate = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    setDate(newDate);
  };

  const decrementDate = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 1);
    setDate(newDate);
  };

  const isToday = date.toDateString() === new Date().toDateString();
  const isTomorrow =
    date.toDateString() ===
    new Date(new Date().setDate(new Date().getDate() + 1)).toDateString();
  const dateString = isToday
    ? "Today"
    : isTomorrow
    ? "Tomorrow"
    : date.toLocaleDateString();

  return (
    <div className="date-picker">
      <button onClick={decrementDate} disabled={isToday}>
        {"<"}
      </button>
      <span>{dateString}</span>
      <button onClick={incrementDate}>{">"}</button>
    </div>
  );
};

export default DatePicker;
