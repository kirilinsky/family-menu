import React from "react";
import { CalendarNav, CalendarDays } from "react-calendar-datetime/modules";
import { Calendar, createTheme } from "react-calendar-datetime";

const orderTheme = createTheme({
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
});

const CalendarWrapper = () => {
  return (
    <div className="calendar-wrap">
      <Calendar readOnly value={new Date()} theme={orderTheme}>
        <CalendarNav showNowTime monthLabel yearLabel />
        <CalendarDays currentMonthOnly fixedRows={false} blockNavigation />
      </Calendar>
    </div>
  );
};

export default CalendarWrapper;
