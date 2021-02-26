import React from "react";
import "./assets/qr.scss";
import { QRCode } from "react-qr-svg";

/* jotai */
import { useAtom } from "jotai";
import { orderAtom } from "../../Atoms";

const QR = () => {
  const [order] = useAtom(orderAtom);
  let filtredOrder = order.map(({ title, quantity }) => ({
    [title]: quantity,
  }));
  if (filtredOrder.length === 0) {
    filtredOrder = "empty list";
  }
  return (
    <div className="qr">
      <QRCode level="Q" value={JSON.stringify(filtredOrder)} />
    </div>
  );
};

export default QR;
