import {Outlet} from "react-router-dom";
import { useState } from "react";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import AdminForm from "../components/AdminForm";

const Layout = ({isAdmin, handleAdminToggle}) => {

  const [showingAdminPage, setShowingAdminPage] = useState(false)
  const handleToggleShowAdminPage = () => {
    setShowingAdminPage((showingAdminPage) => !showingAdminPage)
  }

  return (
    <>
      {showingAdminPage ? <AdminForm handleAdminToggle={handleAdminToggle} handleToggleShowAdminPage={handleToggleShowAdminPage}/> : ""}
      <div className="AppPage">
        <Banner />
        <Outlet />
        {isAdmin ? <p1>is admin</p1> : <p1>not admin</p1>}
        <Footer handleAdminToggle={handleToggleShowAdminPage} />
      </div>
    </>
  )
};

export default Layout;