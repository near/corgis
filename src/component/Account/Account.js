import React, { useContext, useEffect } from "react";
import { Redirect, Link } from "react-router-dom";

import { NearContext } from "../../context/NearContext";
import { ContractContext } from "../../hooks/contract";

import Spinner from "../utils/Spinner";
import AccountCard from "./AccountCard/AccountCard";

export default () => {
  const nearContext = useContext(NearContext);
  const useContract = useContext(ContractContext);
  const { loading, getCorgisList } = useContract;
  let corgiUpdateKey = 0;
  let {corgis} = useContract;
  let Corgis;
  
   useEffect(() => {
       corgis = getCorgisList(nearContext.user.accountId);
   }, [corgiUpdateKey]);  
  
  if (!nearContext.user) {
    return <Redirect to="/" />;
  }
  if (!corgis || loading) {
    Corgis = <Spinner />;
  }
  if (corgis && corgis.length === 0) {
     return <Redirect to="/generation" />;
  }
  if (corgis && corgis.length > 0) {
    corgiUpdateKey = corgiUpdateKey + 1;
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
