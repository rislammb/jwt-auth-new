import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import { UserContext } from "../App";

const Content = () => {
  const [user] = useContext(UserContext);

  if (user.accesstoken) return <div className="content">Home page</div>;
  return <Redirect to="/login" />;
};

export default Content;
