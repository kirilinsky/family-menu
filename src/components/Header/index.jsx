import React from "react";
import styles from "./assets/header.module.scss";
import table from "./assets/table.svg";

import cart from "./assets/cart.svg";
import qr from "./assets/qr-code.svg";
/* jotai */

import { useAtom } from "jotai";
import {
  tableNumberAtom,
  mobileMenuAtom,
  qrMobileAtom,
  orderAtom,
} from "../../Atoms";

const Header = () => {
  const [orders] = useAtom(orderAtom);
  const [tableNumber] = useAtom(tableNumberAtom);
  const [_, set_mobile] = useAtom(mobileMenuAtom);
  const [__, set_mobileqr] = useAtom(qrMobileAtom);
  const openMobile = () => {
    set_mobile("mobile will-opened");
    setTimeout(() => {
      set_mobile("mobile");
    }, 500);
  };
  const openMobileQr = () => {
    set_mobileqr("mobileqr will-opened");
    setTimeout(() => {
      set_mobileqr("mobileqr");
    }, 500);
  };
  return (
    <div className={styles.header}>
      <div className={styles.logo}></div>

      <div className={styles.header_wrap}>
        <div className={styles.name}>
          {tableNumber || "000"} <img src={table} alt="table" />
        </div>{" "}
        <div className={styles.mobile}>
          <button onClick={openMobile} className={styles.mobile_button}>
            <img src={cart} alt="shopping cart" />
            {orders.length !== 0 && (
              <div className={styles.mobile_button_cart}>{orders.length}</div>
            )}
          </button>
          <button onClick={openMobileQr} className={styles.mobile_button}>
            <img src={qr} alt="qr-code" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
