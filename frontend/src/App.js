import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import * as route from "./navigation/route";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Article from "./pages/Article";
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#44C080',
      },
      secondary: {
        main: '#8044c0',
      },
      error: {
        main: '#c04484',
      },
      warning: {
        main: '#4484c0',
      },
      info: {
        main: '#44c0be',
      },
      success: {
        main: '#006232',
      },
      background: {
        default: '#f5f5f5',
        paper: '#e5f1f8',
      },
      luminousA: {
        main: '#e0f4f4',
      },
      luminousB: {
        main: '#b2e3e3',
      },
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
          <CssBaseline enableColorScheme />

            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout/>}>
                        <Route index element={route.HomeRoute.element} />
                        <Route path={route.HomeRoute.path} element={route.HomeRoute.element} />
                        <Route path={route.BlogRoute.path} element={route.BlogRoute.element} />
                        <Route path={route.SecretRoute.path} element={route.SecretRoute.element} />
                        <Route path={`${route.BlogRoute.path}/:article_id`} element={<Article />}/>
                        <Route path="*" element={route.UndefinedRoute.element} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App