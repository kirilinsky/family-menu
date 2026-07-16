import { Calendar, createTheme } from "@dateforge/react-calendar";
import { CalendarDays, CalendarNav } from "@dateforge/react-calendar/modules";
import React from "react";

// Pure Gastronomy tokens (DESIGN.md) — library theme API needs raw values, not CSS vars
const orderTheme = createTheme({
  accent: "#fefefe",
  backdrop: "#ffffff",
  activeText: "#ffffff",
  todayDot: "#ffffff",
  highlight: "#064e3b",
  tone: "#f2f4f6",
  text: "#191c1e",
  stroke: "#e2e8f0",
  shadow: "rgba(0, 0, 0, 0.05)",
  disabled: "#94a3b8",
  weekend: "#6b342d",
  range: "#f2f4f6",
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
