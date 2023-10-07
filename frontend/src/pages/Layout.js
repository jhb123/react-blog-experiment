import {Outlet} from "react-router-dom";
import { useState } from "react";

import { Container } from '@mui/material';


import Banner from "../components/Banner";
import AdminForm from "../components/AdminForm";
import { createContext } from "react";
import {secured_test} from "../requests/admin"

export const AdminContext = createContext(false);

const Layout = () => {

  // temporary debug stuff
  const [isAdmin, setIsAdmin] = useState(false)
  const handlesetIsAdmin = (val) => {
    setIsAdmin(val)
  }

  const [showingAdminPage, setShowingAdminPage] = useState(false)
  

  return (
    <>
      <AdminContext.Provider value={[isAdmin, handlesetIsAdmin]}>
        <Banner handleShowAdminLogin={setShowingAdminPage}/>
        <AdminForm open={showingAdminPage} setOpen={setShowingAdminPage}/>
        <Container sx={{height : "100vh"}}>
            <Outlet />
            {isAdmin ? <p1>is admin</p1> : <p1>not admin</p1>}
        </Container>   
      </AdminContext.Provider>
    </>
  )
};

export default Layout;