import React from "react";
import Gallery from "../Gallery"; 
import "./menu.scss";
import Sidebar from "../Sidebar";
/* jotai */
import { useAtom } from "jotai";
import { orderAtom } from "../../Atoms";


const Menu = () => {
  const [order] = useAtom(orderAtom);
  return (
    <div className={`menu ${order.length === 0 ? "expanded" : "slim"}`}>
      <Sidebar />
      <Gallery />
    </div>
  );
};

export default Menu;
