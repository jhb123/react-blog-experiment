import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import * as route from "./navigation/route";
import { useState } from "react";

const App = () => {

    const [isAdmin, setIsAdmin] = useState(false)
    const handleAdminToggle = (isSuccess) => {
        setIsAdmin(isSuccess)
    }

    return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout isAdmin={isAdmin} handleAdminToggle={handleAdminToggle} />}>
                <Route index element={route.HomeRoute.element} />
                <Route path={route.HomeRoute.path} element={route.HomeRoute.element} />
                <Route path={route.BlogRoute.path} element={route.BlogRoute.element} />
                <Route path={route.ContactRoute.path} element={route.ContactRoute.element} />
                <Route path="*" element={route.UndefinedRoute.element} />
            </Route>
        </Routes>
    </BrowserRouter>
    );
}

export default App