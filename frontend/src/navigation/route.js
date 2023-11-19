import Writing from "../pages/Writing";
import Home from "../pages/Home";
import NoPage from "../pages/NoPage";
import Secret from "../pages/Secret";

export const BlogRoute = {
    path:  "/writing",
    name : "writing",
    icon : undefined,
    element : <Writing />
}

export const SecretRoute = {
    path:  "/secret",
    name : "secret",
    icon : undefined,
    element : <Secret />
}

export const HomeRoute = {
    path:  "/",
    name : "Home",
    icon : undefined,
    element : <Home />
}


export const UndefinedRoute = {
    path:  "*",
    name : "Undefined Page",
    icon : undefined,
    element : <NoPage />
}

//  default BlogRoute;
