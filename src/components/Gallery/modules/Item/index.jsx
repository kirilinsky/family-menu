import React from "react";
import "./item.scss";
/* jotai */
import { useAtom } from "jotai";
import { orderAtom } from "../../../../Atoms";
const Item = ({ item }) => {
  const [order, setOrder] = useAtom(orderAtom);

  const addItem = (item) => {
    let arr = [...order];
    if (arr.find((x) => x.id === item.id)) {
      arr.map((x) => {
        if (x.id === item.id) {
          return {
            ...x,
            quantity: x.quantity++,
          };
        } else {
          return x;
        }
      });
    } else {
      arr.push({ ...item, quantity: 1 });
    }

    setOrder(arr);
  };
  return (
    <div className="item">
      <div className="item-img">
        <img
          src={require(`../../data/img/${item.img}`).default}
          alt={item.img}
        />
      </div>
      <div className="item-info">
        <div className="item-info-terms">
          <span> {item.title}</span>
          <span> {item.price}</span>
        </div>
        <div className="item-info-control">
          <button onClick={() => addItem(item)}>добавить</button>
        </div>
      </div>
    </div>
  );
};

export default Item;
