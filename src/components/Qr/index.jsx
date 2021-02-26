import React from "react"; 
import "./assets/qr.scss";
import { QRCode } from "react-qr-svg";

/* jotai */
import { useAtom } from "jotai";
import { orderAtom } from "../../Atoms";

const QR = () => {
  const [order] = useAtom(orderAtom);
  const filtredOrder = order.map(({ title, quantity }) => ({
    [title]: quantity,
  }));
  return (
    <div className="qr">
      {order.length === 0 ? (
        ""
      ) : (
        <QRCode level="Q" value={JSON.stringify(filtredOrder)} />
      )}
    </div>
  );
};

export default QR;
