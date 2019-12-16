import React, { useState, useContext, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";

import { UserContext } from "../App";

const Login = () => {
  const [user, setUser] = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    if (email && password) {
      const result = await (
        await fetch("/login", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, password })
        })
      ).json();
      if (result.accesstoken)
        return setUser({
          accesstoken: result.accesstoken
        });
      if (result.error) return alert(result.error);
    } else {
      alert("Must fill all fields");
    }
  };

  const handleChane = e => {
    if (e.target.name === "email") {
      setEmail(e.target.value);
    } else {
      setPassword(e.target.value);
    }
  };

  useEffect(() => {
    console.log(user);
  }, [user]);

  if (user.accesstoken) return <Redirect to="/" />;
  return (
    <div className="form-wrapper">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            name="email"
            value={email}
            placeholder="Enter Your Email"
            onChange={handleChane}
            autoComplete="emmail"
          />
        </div>
        <div className="input-group">
          <input
            type="text"
            value={password}
            name="password"
            placeholder="Enter Your Password"
            onChange={handleChane}
            autoComplete="current-password"
          />
        </div>
        <div className="input-group">
          <button type="submit">Login</button>
        </div>
      </form>
      <span>
        Don't have a account? Please register <Link to="/register">here</Link>
      </span>
    </div>
  );
};

export default Login;
