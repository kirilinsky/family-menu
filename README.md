# Padmenu

A tablet-first restaurant menu app. Guests browse dishes, build an order, and hand it to the waiter via a QR code — no paper menus, no app installs required.

## Stack

React 17 · Jotai · SCSS · react-transition-group · react-qr-svg

## How it works

1. Guest opens the app on a table tablet
2. Browses the menu gallery and adds items to the cart
3. The sidebar shows a live receipt with quantities and running total
4. A QR code encodes the full order as JSON — the waiter scans it to submit

## Getting started

```bash
npm install
npm start
```

## Deploy to Vercel

```bash
npm install -g vercel   # one-time
npm run deploy
```

Or connect the repo at [vercel.com](https://vercel.com) — it auto-detects Create React App and reads settings from `vercel.json`.

## Project structure

```
src/
  components/
    Header/        logo, table number, mobile nav buttons
    Menu/          layout shell (sidebar + gallery)
    Gallery/       dish grid + category nav
      data/        menu items — title, price, image URL
      modules/Item/
    Sidebar/       wraps Order and QR panel
    Order/         cart receipt, quantity controls, clear button
    Qr/            QR code generated from current order
    MobileMenu/    slide-in cart for small screens
    QrMobile/      slide-in QR panel for small screens
  Atoms/           jotai atoms: order, tableNumber, mobile panel states
```
