import React, { useContext } from "react";
import { Redirect, Link } from "react-router-dom";

import { NearContext } from "../../context/NearContext";
import useContract from "../../hooks/contract";

import Spinner from "../common/spinner/spinner";
import AccountCard from "./AccountCard/AccountCard";

export default () => {
  const nearContext = useContext(NearContext);
  const { corgis, loading } = useContract();
  if (!nearContext.user) {
    return <Redirect to="/" />;
  }
  let Corgis;
  if (loading) {
    Corgis = <Spinner />;
  }
  if (corgis && corgis.length === 0) {
    return <Redirect to="/generation" />;
  }
  if (corgis.length > 0) {
    Corgis = corgis.map((corgi) => {
      return (
        <Link
          to={{
            pathname: "/@" + corgi.name,
            hash: corgi.id,
          }}
          key={corgi.id}
        >
          <AccountCard corgi={corgi} />
        </Link>
      );
    });
  }
  return (
    <div>
      <div>
        <h1 className="head">Your Pack</h1>
        <p>Create,collect,send or trade</p>
      </div>
      <div>{Corgis}</div>
    </div>
  );
};
