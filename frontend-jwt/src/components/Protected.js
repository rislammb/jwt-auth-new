import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../App";

const Protected = () => {
  const [user] = useContext(UserContext);
  const [data, setData] = useState("You need to login");

  useEffect(() => {
    async function fetchProtected() {
      const result = await (
        await fetch("/protected", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            authorization: `Brarer ${user.accesstoken}`
          }
        })
      ).json();
      if (result.data) setData(result.data);
    }
    fetchProtected();
  }, [user]);

  return <div className="content">{data}</div>;
};

export default Protected;
