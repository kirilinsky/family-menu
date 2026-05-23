import type { MouseEvent } from "react";
import "./mobileMenu.scss";
import { useAtom } from "jotai";
import { mobileMenuAtom } from "../../Atoms";
import Order from "../Order";
import CalendarWrapper from "../CalendarWrapper";

const MobileMenu = () => {
  const [mobile, set_mobile] = useAtom(mobileMenuAtom);

  const closeMenu = (e: MouseEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).classList.contains("trigger")) {
      set_mobile("mobile will-closed");
      setTimeout(() => {
        set_mobile("mobile closed");
      }, 1000);
    }
  };
  return (
    <div className={mobile + " trigger"} onClick={closeMenu}>
      <div className="mobile-menu">
        <div className="mobile-menu-order">
          <Order />
        </div>
        <CalendarWrapper />
        <button className="mobile-menu-close trigger" onClick={closeMenu}>
          &times;
        </button>
      </div>
      ;
    </div>
  );
};

export default MobileMenu;
