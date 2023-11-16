import React from 'react';
import {Link, useMatch, useResolvedPath} from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

import * as route from "../navigation/route";
import { width } from '@mui/system';


const BannerButton = ({to, children, ...props}) => {
  const resolvedPath = useResolvedPath(to)
  const isActive = useMatch({path : resolvedPath.pathname, end :true })

  return(
    <Box sx={{p:1}}>
      <Button component={Link} to={to} color = {isActive ? "primary": "secondary"} variant ="text" >
        <Typography>{children}</Typography>
      </Button>
    </Box>);
}


const Banner = ({handleShowAdminLogin}) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky" color="background">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Joseph Briggs
          </Typography>
          <BannerButton to = {route.HomeRoute.path}>{route.HomeRoute.name}</BannerButton>
          <BannerButton to = {route.BlogRoute.path}>{route.BlogRoute.name}</BannerButton>
          <IconButton color="inherit" onClick={handleShowAdminLogin}>
            <AdminPanelSettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
};


export default Banner;