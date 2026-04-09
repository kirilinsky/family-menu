import { useAtom } from "jotai";
import { isAuthorizedAtom, tableNumberAtom, waiterAtom } from "./Atoms";

import Header from "./components/Header";
import Menu from "./components/Menu";
import MobileMenu from "./components/MobileMenu";
import QRMobile from "./components/QrMobile";
import AuthScreen from "./components/AuthScreen";

function App() {
  const [isAuthorized] = useAtom(isAuthorizedAtom);
  const [tableNumber] = useAtom(tableNumberAtom);
  const [waiter] = useAtom(waiterAtom);

  const needsAuth = !isAuthorized || !tableNumber || !waiter;

  if (needsAuth) {
    return <AuthScreen />;
  }

  return (
    <div className="wrap">
      <Header />
      <Menu />
      <MobileMenu />
      <QRMobile />
    </div>
  );
}

export default App;
