import React from "react";
import { Link } from "react-router-dom";

import MainHeader from "./MainHeader";
import "./MainNavigation.css";
import NavLinks from "./NavLinks";

const MainNavigation = (props) => {
  return (
    <React.Fragment>
      <MainHeader>
        <h1 className='main-navigation__title'>
          <Link to='/'>Web Gallery</Link>
        </h1>
        <nav className='main-navigation__header-nav'>
          <NavLinks />
        </nav>
      </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
