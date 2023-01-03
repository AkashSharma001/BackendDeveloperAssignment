import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import "./NavLinks.css";

const NavLinks = (props) => {
  const auth = useContext(AuthContext);
  return (
    <>
      <ul className='nav-links center-items'>
        {auth.isLoggedIn && (
          <li>
            <NavLink to={`/`}>Gallery</NavLink>
          </li>
        )}
        {auth.isLoggedIn && (
          <li>
            <NavLink to='/profile'>Profile</NavLink>
          </li>
        )}

        {!auth.isLoggedIn && (
          <li style={{ position: "absolute", right: "5%", top: "25%" }}>
            <NavLink to='/auth'>Auth</NavLink>
          </li>
        )}
        {auth.isLoggedIn && <button onClick={auth.logout}>Logout</button>}
      </ul>
    </>
  );
};

export default NavLinks;
