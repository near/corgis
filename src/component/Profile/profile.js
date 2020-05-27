import React, { useContext, useEffect } from "react";
import { Redirect } from "react-router-dom";

import { NearContext } from "../../context/NearContext";
import useContract from "../../hooks/contract";

import ProfileRow from "./ProfileRow/ProfileRow";
import Spinner from "../common/spinner/spinner";

import goodbye from "../../assets/images/good-bye.svg";
export default () => {
  const nearContext = useContext(NearContext);
  const {
    corgis,
    loading,
    deleteCorgi,
    getCorgisList,
    deleting,
    error,
  } = useContract();
  useEffect(() => {
    getCorgisList(nearContext.user.accountId);
  }, [getCorgisList, nearContext]);
  if (!nearContext.user) {
    return <Redirect to="/" />;
  }
  if (!nearContext.user) {
    return <Redirect to="/" />;
  }
  if (loading) {
    return <Spinner />;
  }
  if (corgis && corgis.length === 0) {
    return <Redirect to="/generation" />;
  }
  let Corgis;
  if (corgis.length > 0) {
    Corgis = corgis.map((corgi) => {
      return <ProfileRow deleteCorgi={deleteCorgi} corgi={corgi} />;
    });
  }
  if (deleting) {
    return <img src={goodbye} alt="Good Bye" />;
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
