import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const tableNumberAtom = atomWithStorage("tableNumber", "");
export const waiterAtom = atomWithStorage("waiter", "");
export const isAuthorizedAtom = atomWithStorage("isAuthorized", false);

export const orderAtom = atom([]);

export const mobileMenuAtom = atom("mobile closed");
export const qrMobileAtom = atom("mobileqr closed");
