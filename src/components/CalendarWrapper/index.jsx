import React from "react";
import { CalendarNav } from "react-calendar-datetime/modules";
import { Calendar, CalendarDays, createTheme } from "react-calendar-datetime";

const orderTheme = createTheme(
  {
    accent: "#fefefe",
    backdrop: "#ffffff",
    highlight: "#523637",
    tone: "#f4f4f5",
    text: "#18181b",
    stroke: "#e4e4e7",
    shadow: "rgba(24, 24, 27, 0.08)",
    disabled: "#a1a1aa",
    weekend: "#7e4446",
    range: "#f4f4f5",
  },
  "light",
);

const CalendarWrapper = () => {
  return (
    <div className="calendar-wrap">
      <Calendar readonly value={new Date()} theme={orderTheme}>
        <CalendarNav showSelectedMonthLabel />
        <CalendarDays preventUnselect hideOtherMonths />
      </Calendar>
    </div>
  );
};

export default CalendarWrapper;
