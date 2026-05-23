import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type OrderItem = {
  id: string;
  title: string;
  img: string;
  price: string;
  quantity: number;
};

export const tableNumberAtom = atomWithStorage("tableNumber", "");
export const waiterAtom = atomWithStorage("waiter", "");
export const isAuthorizedAtom = atomWithStorage("isAuthorized", false);

export const orderAtom = atom<OrderItem[]>([]);

export const mobileMenuAtom = atom("mobile closed");
export const qrMobileAtom = atom("mobileqr closed");
