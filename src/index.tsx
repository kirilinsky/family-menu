import { createRoot } from "react-dom/client";
import { Provider } from "jotai";
import App from "./App";
import "./index.scss";

const root = createRoot(document.getElementById("root")!);
root.render(
  <Provider>
    <App />
  </Provider>
);
