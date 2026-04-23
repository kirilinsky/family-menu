import { Calendar, CalendarDays, createTheme } from "react-calendar-datetime";
import Order from "../Order";
import QR from "../Qr";
import "./sidebar.scss";
import CalendarWrapper from "../CalendarWrapper";


const Sidebar = () => {
  return (
    <div className="sidebar">
      <Order />
      <CalendarWrapper/>  
      <QR />
    </div>
  );
};

export default Sidebar;
