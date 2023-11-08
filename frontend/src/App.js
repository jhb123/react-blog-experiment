import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import * as route from "./navigation/route";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Article from "./pages/Article";

const theme = createTheme({
    palette: {
      ochre: {
        main: '#E3D026',
        light: '#E9DB5D',
        dark: '#A29415',
        contrastText: '#242105',
      },
      tool: {
        main: '#555',
        light: '#777',
        dark: '#111',
        contrastText: '#eee',
      },
      toolVariant: {
        main: '#222',
        light: '#777',
        dark: '#111',
        contrastText: '#eee',
      },
    },
  });

const App = () => {

    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout/>}>
                        <Route index element={route.HomeRoute.element} />
                        <Route path={route.HomeRoute.path} element={route.HomeRoute.element} />
                        <Route path={route.BlogRoute.path} element={route.BlogRoute.element} />
                        <Route path={route.ContactRoute.path} element={route.ContactRoute.element} />
                        <Route path={"/Article/:article_id"} element={<Article />}/>
                        <Route path="*" element={route.UndefinedRoute.element} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App