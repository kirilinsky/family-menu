import { useMemo } from "react";
import "./order.scss";
import { CSSTransition, TransitionGroup } from "react-transition-group";
/* jotai */
import { useAtom } from "jotai";
import { orderAtom } from "../../Atoms";
import SubTotal from "./modules/SubTotal";
const Order = () => {
  const [orders, setOrder] = useAtom(orderAtom);

  const total = useMemo(() => {
    return orders.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0).toFixed(2);
  }, [orders]);
  const clearOrder = () => {
    setOrder([]);
  };
  return (
    <div className="order cell">
      {orders.length === 0 ? (
        <div className="order-empty">Your cart is empty</div>
      ) : (
        <div className="order-wrap">
          <div className="order-title">Your order</div>

          <TransitionGroup className="order-reciept">
            {orders.map((x) => (
              <CSSTransition classNames="item" timeout={500} key={x.id}>
                <SubTotal item={x} />
              </CSSTransition>
            ))}
          </TransitionGroup>
          <div className="order-reciept-total">Total: €{total}</div>
          <button className="order-reciept-button" onClick={clearOrder}>
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default Order;
