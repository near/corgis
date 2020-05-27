import React, { useContext, useEffect } from "react";
import { Redirect } from "react-router-dom";

import { NearContext } from "../../context/NearContext";
import useContract from "../../hooks/contract";

import Poster from "./Poster/Poster";
import ShowCase from "./ShowCase/ShowCase";

export default () => {
  const nearContext = useContext(NearContext);
  const { corgis, getDisplayCorgis, displayCorgis } = useContract();
  useEffect(() => getDisplayCorgis(), [getDisplayCorgis]);

  const signIn = () => {
    nearContext.signIn();
  };

  if (nearContext.user && corgis.length === 0) {
    return <Redirect to="/generation" />;
  }
  return (
    <div className="Dash">
      <Poster
        requestSignIn={signIn}
        isLoading={nearContext.isLoading}
        user={nearContext.user}
      />
      <ShowCase displayCorgis={displayCorgis} />
      <style>{`
            .Dash {
                width: 100%;
                margin: auto;
                display: grid;
                text-align: center;
            }
        `}</style>
    </div>
  );
};
