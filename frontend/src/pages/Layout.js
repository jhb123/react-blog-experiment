import {Outlet} from "react-router-dom";
import Banner from "../components/Banner";
import Footer from "../components/Footer";

const Layout = () => {
  return (
      <div className="AppPage">
        <Banner />
        <Outlet />
        <Footer />
      </div>
  )
};

export default Layout;