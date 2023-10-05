import React from 'react';
import {Link, useMatch, useResolvedPath} from "react-router-dom";
import * as route from "../navigation/route";


const BannerLink = ({to, children, ...props}) => {
  const resolvedPath = useResolvedPath(to)
  const isActive = useMatch({path : resolvedPath.pathname, end :true })
  return(
  <li className={isActive ? "onBackground" : ""}>
    <Link to={to} {...props}>{children}</Link>
  </li>
  );
}

const Banner = () => {
  return (
    <>
      <nav className='nav background'>
        <h1 className="bannerTitle">Joseph Briggs</h1>
        <ul>
          <BannerLink to = {route.HomeRoute.path}>{route.HomeRoute.name}</BannerLink>
          <BannerLink to = {route.BlogRoute.path}>{route.BlogRoute.name}</BannerLink>
          <BannerLink to = {route.ContactRoute.path}>{route.ContactRoute.name}</BannerLink>
        </ul>
      </nav>
    </>
  );
};


export default Banner;