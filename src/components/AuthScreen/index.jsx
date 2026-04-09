import { useState } from "react";
import { useAtom } from "jotai";
import { tableNumberAtom, waiterAtom, isAuthorizedAtom } from "../../Atoms";
import styles from "./assets/auth.module.scss";

const WAITERS = ["Alex", "Maria", "Pier", "Kate", "Leon", "John", "Tahita"];
const TOTAL_TABLES = 25;

const TablePicker = ({ value, onChange }) => {
  const [animKey, setAnimKey] = useState(0);
  const [animDir, setAnimDir] = useState("right");

  const current = parseInt(value, 10) || 1;

  const go = (dir) => {
    let next;
    if (dir === "right") {
      next = current >= TOTAL_TABLES ? 1 : current + 1;
    } else {
      next = current <= 1 ? TOTAL_TABLES : current - 1;
    }
    setAnimDir(dir);
    setAnimKey((k) => k + 1);
    onChange(String(next).padStart(3, "0"));
  };

  return (
    <div className={styles.picker}>
      <button className={styles.picker_arrow} onClick={() => go("left")}>
        ‹
      </button>
      <div className={styles.picker_window}>
        <span
          key={animKey}
          className={`${styles.picker_num} ${
            animDir === "right" ? styles.from_right : styles.from_left
          }`}
        >
          {value}
        </span>
      </div>
      <button className={styles.picker_arrow} onClick={() => go("right")}>
        ›
      </button>
    </div>
  );
};

const AuthScreen = () => {
  const [, setTableNumber] = useAtom(tableNumberAtom);
  const [, setWaiter] = useAtom(waiterAtom);
  const [, setIsAuthorized] = useAtom(isAuthorizedAtom);

  const [selectedWaiter, setSelectedWaiter] = useState("");
  const [selectedTable, setSelectedTable] = useState("001");
  const [error, setError] = useState("");

  const handleStart = () => {
    if (!selectedWaiter) {
      setError("Please select a waiter");
      return;
    }
    setWaiter(selectedWaiter);
    setTableNumber(selectedTable);
    setIsAuthorized(true);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.title}>Start Shift</div>

        <div className={styles.field}>
          <label className={styles.label}>Waiter</label>
          <div className={styles.grid}>
            {WAITERS.map((w) => (
              <button
                key={w}
                className={`${styles.chip} ${
                  selectedWaiter === w ? styles.chip_active : ""
                }`}
                onClick={() => {
                  setSelectedWaiter(w);
                  setError("");
                }}
              >
                {w}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Table</label>
          <TablePicker value={selectedTable} onChange={setSelectedTable} />
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button
          className={styles.submit}
          onClick={handleStart}
          disabled={!selectedWaiter}
        >
          Open Shift
        </button>
      </div>
    </div>
  );
};

export default AuthScreen;
