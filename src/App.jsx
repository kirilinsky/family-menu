import Header from "./components/Header";
import Menu from "./components/Menu";
import MobileMenu from "./components/MobileMenu";
import QRMobile from "./components/QrMobile";

function App() {
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
