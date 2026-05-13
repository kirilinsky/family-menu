import { Calendar, createTheme } from "@dateforge/react-calendar";
import { CalendarDays, CalendarNav } from "@dateforge/react-calendar/modules";
import React from "react";

const orderTheme = createTheme({
  accent: "#fefefe",
  backdrop: "#ffffff",
  activeText: "#fff",
  todayDot: "#fff",
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
        <CalendarDays boldWeekends currentMonthOnly fixedRows={false} blockNavigation />
      </Calendar>
    </div>
  );
};

export default CalendarWrapper;
