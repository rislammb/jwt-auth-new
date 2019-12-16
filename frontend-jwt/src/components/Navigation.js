import React, { useContext, Fragment } from "react";
import { Link } from "react-router-dom";

import { UserContext } from "../App";

const Navigation = ({ handleLogout }) => {
  const [user] = useContext(UserContext);

  return (
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/protected">Protected</Link>
      </li>

      {user.accesstoken ? (
        <li>
          <Link to="/" onClick={handleLogout}>
            Log Out
          </Link>
        </li>
      ) : (
        <Fragment>
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </Fragment>
      )}
    </ul>
  );
};

export default Navigation;
