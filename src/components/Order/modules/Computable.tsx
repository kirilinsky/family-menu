import minus from "../assets/minus.svg";
import plus from "../assets/plus.svg";
import close from "../assets/close.svg";
import { useAtom } from "jotai";
import { orderAtom, type OrderItem } from "../../../Atoms";

const Computable = ({ item }: { item: OrderItem }) => {
  const [orders, setOrders] = useAtom(orderAtom);

  const decrement = () => {
    setOrders(orders.map((x) => (x.id === item.id ? { ...x, quantity: x.quantity - 1 } : x)));
  };
  const increment = () => {
    setOrders(orders.map((x) => (x.id === item.id ? { ...x, quantity: x.quantity + 1 } : x)));
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
      €{(item.quantity * parseFloat(item.price)).toFixed(2)}
    </div>
  );
};

export default Computable;
