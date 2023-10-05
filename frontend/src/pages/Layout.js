import {Outlet} from "react-router-dom";
import { useState } from "react";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import AdminForm from "../components/AdminForm";
import { createContext } from "react";
import {secured_test} from "../requests/admin"

export const AdminContext = createContext(false);

const Layout = () => {

  // temporary debug stuff
  const [isAdmin, setIsAdmin] = useState(false)
  const handlesetIsAdmin = (val) => {
    setIsAdmin((showingAdminPage) => val)
  }

  const [showingAdminPage, setShowingAdminPage] = useState(false)
  const handleToggleShowAdminPage = () => {
    setShowingAdminPage((showingAdminPage) => !showingAdminPage)
  }

  return (
    <>
      <AdminContext.Provider value={[isAdmin, handlesetIsAdmin]}>
        {showingAdminPage ? <AdminForm handleToggleShowAdminPage={handleToggleShowAdminPage}/> : ""}
        <div className="AppPage">
          <Banner />
          <Outlet />
          {isAdmin ? <p1>is admin</p1> : <p1>not admin</p1>}
          {isAdmin ? <button className="primary" onClick={secured_test}>secured</button> : ""}
          <Footer handleAdminToggle={handleToggleShowAdminPage} />
        </div>
      </AdminContext.Provider>
    </>
  )
};

export default Layout;