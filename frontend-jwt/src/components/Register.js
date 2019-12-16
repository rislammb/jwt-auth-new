import React, { useState, useContext } from "react";
import { Link, Redirect } from "react-router-dom";
import { UserContext } from "../App";

const Register = () => {
  const [user, setUser] = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    if (email && password) {
      const result = await (
        await fetch("/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, password })
        })
      ).json();
      if (result.error) return alert(result.error);
      setUser({ accesstoken: result.accesstoken });
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

  if (user.accesstoken) return <Redirect to="/" />;
  return (
    <div className="form-wrapper">
      <h2>Register</h2>
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
          <button type="submit">Register</button>
        </div>
      </form>
      <span>
        You have a account? Login <Link to="/login">here</Link>
      </span>
    </div>
  );
};

export default Register;
