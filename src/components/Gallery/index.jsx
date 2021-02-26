import React from "react";

/* jotai */
/* import { useAtom } from "jotai";
import { orderAtom } from "../../Atoms"; */
import { main } from "./data";
import Item from "./modules/Item";
import "./gallery.scss";
const Gallery = () => {
  /* const [order, setOrder] = useAtom(orderAtom); */

  return (
    <div className="cell gallery">
      <div className="gallery-nav">Основные блюда</div>
      <div className="gallery-grid">
        {main.map((item, index) => (
          <Item key={index} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Gallery;
