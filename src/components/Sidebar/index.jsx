import React from "react";
import Order from "../Order";
import QR from "../Qr";
import "./sidebar.scss";
const Sidebar = () => {
  return (
    <div className="sidebar">
      <Order />
      <QR />
    </div>
  );
};

export default Sidebar;
