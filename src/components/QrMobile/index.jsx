import React from "react";
import QR from "../Qr";
import "./qrMobile.scss";

/* jotai */
import { useAtom } from "jotai";
import { qrMobileAtom } from "../../Atoms";

const QRMobile = () => {
  const [mobileqr, set_mobile] = useAtom(qrMobileAtom);

  const closeMenu = (e) => {
    if (e.target.classList.contains("trigger")) {
      set_mobile("mobileqr will-closed");
      setTimeout(() => {
        set_mobile("mobileqr closed");
      }, 1000);
    }
  };
  return (
    <div className={mobileqr + " trigger"} onClick={closeMenu}>
      <div className="mobileqr-menu">
        <div className="mobileqr-menu-qr">
          <QR />
        </div>
        <button className="mobileqr-menu-close trigger" onClick={closeMenu}>
          &times;
        </button>{" "}
      </div>
      ;
    </div>
  );
};

export default QRMobile;
