import Computable from "./Computable";

const SubTotal = ({ item }) => {
  return (
    <div className="order-reciept-cell">
      <div className="order-reciept-cell-row">
        <div style={{ textAlign: "center", flexGrow: 1 }}>{item.title}</div>
        <span>${item.price}</span>
      </div>
      <Computable item={item} />
    </div>
  );
};

export default SubTotal;
