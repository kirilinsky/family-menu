import { QRCodeSVG } from "qrcode.react";
import "./assets/qr.scss";
import { useAtom } from "jotai";
import { orderAtom } from "../../Atoms";

const QR = () => {
  const [order] = useAtom(orderAtom);
  const payload = order.length
    ? order.map(({ title, quantity }) => ({ [title]: quantity }))
    : "empty";

  return (
    <div className="qr">
      <QRCodeSVG value={JSON.stringify(payload)} size={220} level="Q" />
    </div>
  );
};

export default QR;
