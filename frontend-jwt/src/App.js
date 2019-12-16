import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Navigation from "./components/Navigation";
import Content from "./components/Content";
import Protected from "./components/Protected.js";
import Login from "./components/Login";
import Register from "./components/Register";

export const UserContext = React.createContext([]);

const App = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const handleLogout = async e => {
    const result = await (
      await fetch("/logout", {
        method: "POST"
      })
    ).json();
    if (result.message) setUser({});
  };

  useEffect(() => {
    async function checkRefreshToken() {
      const result = await (
        await fetch("/refresh_token", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          }
        })
      ).json();
      setUser({ accesstoken: result.accesstoken });
      setLoading(false);
    }
    checkRefreshToken();
  }, []);

  if (loading) return <div>Loading...</div>;
  return (
    <UserContext.Provider value={[user, setUser]}>
      <Router>
        <div className="App">
          <Navigation handleLogout={handleLogout} />
          <Switch>
            <Route exact path="/" component={Content} />
            <Route exact path="/protected" component={Protected} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
          </Switch>
        </div>
      </Router>
    </UserContext.Provider>
  );
};

export default App;
