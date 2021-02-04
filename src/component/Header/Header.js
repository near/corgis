import React, { useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";

import { NearContext } from "../../context/NearContext";
import { ContractContext } from "../../context/contract";

import Nav from "./Nav/Nav";

import logo from "../../assets/images/logo.png";
import Spinner from "../utils/Spinner";
import Button from "../utils/Button";

export default () => {
  const nearContext = useContext(NearContext);
  const useContract = useContext(ContractContext);
  const { getCorgisList, corgis } = useContract;
  useEffect(() => {
    if (nearContext.user) {
      getCorgisList(nearContext.user.accountId);
    }
  }, [getCorgisList, nearContext]);

  const signIn = () => {
    nearContext.signIn();
  };
  const signOut = () => {
    nearContext.signOut();
  };

  if (nearContext.isLoading) {
    return <Spinner />;
  }
  let show;
  if (nearContext.user) {
    show = (
      <div className="header">
        <NavLink exact to="/">
          <img src={logo} style={{ minWidth: "100px", width: "70%" }} alt="" />
        </NavLink>
        <Nav
          accountName={nearContext.user.accountId}
          number={corgis ? corgis.length : "..."}
          requestSignOut={signOut}
        />
      </div>
    );
  } else {
    show = (
      <div className="header">
        <NavLink exact to="/">
          <img src={logo} style={{ minWidth: "100px", width: "60%" }} alt="" />
        </NavLink>
        <Button description="Get Started" action={signIn} />
      </div>
    );
  }
  return (
    <div>
      {show}
      <style>{`
        .header {
            margin: 1% auto;
            padding: auto;
            display: flex;
            justify-content: space-between;
            width: 70%;
            max-width: 1000px;
        }
        
        @media all and (max-width: 751px) {
            .header{
                width: 90%;
                margin: 1% auto;
            }
        }
        
        @media all and (max-width: 376px) {
            .header{
                width: 90%;
                margin: 1% auto;
                flex-direction: column;
            }
        }    
    `}</style>
    </div>
  );
};
