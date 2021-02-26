import React from "react";
import minus from "../assets/minus.svg";
import plus from "../assets/plus.svg";
import close from "../assets/close.svg";
/* jotai */
import { useAtom } from "jotai";
import { orderAtom } from "../../../Atoms";

const Computable = ({ item }) => {
  const [orders, setOrders] = useAtom(orderAtom);

  const decrement = () => {
    let arr = [...orders];

    arr.map((x) => {
      if (x.id === item.id) {
        return { ...x, quantity: x.quantity-- };
      } else {
        return x;
      }
    });
    setOrders(arr);
  };
  const increment = () => {
    let arr = [...orders];

    arr.map((x) => {
      if (x.id === item.id) {
        return { ...x, quantity: x.quantity++ };
      } else {
        return x;
      }
    });
    setOrders(arr);
  };
  const cut = () => {
    setOrders(orders.filter((x) => x.id !== item.id));
  };
  return (
    <div className="order-reciept-cell-row">
      {item.quantity === 1 ? (
        <button onClick={cut} className="order-reciept-cell-row-button">
          <img src={close} alt="close" />
        </button>
      ) : (
        <button onClick={decrement} className="order-reciept-cell-row-button">
          <img src={minus} alt="minus" />
        </button>
      )}
      {item.quantity}
      <button onClick={increment} className="order-reciept-cell-row-button">
        <img src={plus} alt="plus" />
      </button>
      {item.quantity * item.price}.₽
    </div>
  );
};

export default Computable;
