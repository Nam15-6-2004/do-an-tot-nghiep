import { Outlet, useLocation } from "react-router-dom";
import Header from "../Headers";
import Footers from "../Footers";

function LayoutDefault() {
  const location = useLocation();
  const pageClass = location.pathname === "/" ? "home-page" : "other-page";
  return (
    <>
      <header>
        <Header />
      </header>
      <main className={pageClass}>
        <Outlet />
      </main>
      <footer>
        <Footers />
      </footer>
    </>
  );
}
export default LayoutDefault;
