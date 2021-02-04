import React, { useContext } from "react";
import { Redirect } from "react-router-dom";

import { NearContext } from "../../context/NearContext";
import { ContractContext } from "../../context/contract";

import ProfileRow from "./ProfileRow/ProfileRow";
import Spinner from "../utils/Spinner";

import { CorgiTwo } from "../utils/corgiAnimation";

export default () => {
  const nearContext = useContext(NearContext);
  const useContract = useContext(ContractContext);
  const { corgis, loading, deleteCorgi, deleting, error } = useContract;
  if (!nearContext.user) {
    return <Redirect to="/" />;
  }
  if (!corgis || loading) {
    return <Spinner />;
  }
  if (corgis && corgis.length === 0) {
    return <Redirect to="/generation" />;
  }
  let Corgis;
  if (corgis && corgis.length > 0) {
    Corgis = corgis.map((corgi) => {
      return (
        <ProfileRow deleteCorgi={deleteCorgi} corgi={corgi} key={corgi.id} />
      );
    });
  }
  if (deleting) {
    return (
      <div className="box">
        <CorgiTwo color={"black"} />
        <style>{`
      .box {
        animation-name: spin;
        animation-duration: 5000ms;
        animation-iteration-count: infinite;
        animation-timing-function: linear; 
      }
      @keyframes spin {
        from {
            transform:rotate(0deg);
        }
        to {
            transform:rotate(360deg);
        }
      }
    `}</style>
      </div>
    );
  }
  return (
    <div>
      <h1>Your Corgis</h1>
      <p>look and delete</p>
      {error && <p>{error}</p>}
      <div>{Corgis}</div>
    </div>
  );
};
