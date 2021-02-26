import React from "react";
import styles from "./assets/header.module.scss";
import table from "./assets/table.svg";
/* jotai */

import { useAtom } from "jotai";
import { tableNumberAtom } from "../../Atoms";
const Header = () => {
  const [tableNumber] = useAtom(tableNumberAtom);

  return (
    <div className={styles.header}>
      <div className={styles.logo}></div>
      <div className={styles.name}>
        {tableNumber || "000"} <img src={table} alt="table" />
      </div>
    </div>
  );
};

export default Header;
