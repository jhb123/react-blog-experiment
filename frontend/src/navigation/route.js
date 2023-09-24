import Blogs from "../pages/Blogs";
import Home from "../pages/Home";
import Contact from "../pages/Contact";
import NoPage from "../pages/NoPage";

export const BlogRoute = {
    path:  "/Blogs",
    name : "Blogs",
    icon : undefined,
    element : <Blogs />
}

export const HomeRoute = {
    path:  "/",
    name : "Home",
    icon : undefined,
    element : <Home />
}

export const ContactRoute = {
    path:  "/Contact",
    name : "Contact",
    icon : undefined,
    element : <Contact />
}

export const UndefinedRoute = {
    path:  "*",
    name : "Undefined Page",
    icon : undefined,
    element : <NoPage />
}


//  default BlogRoute;
