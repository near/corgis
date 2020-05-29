import React, { useContext } from "react";
import { Redirect } from "react-router-dom";

import useCharacter from "../../hooks/character";
import { ContractContext } from "../../hooks/contract";
import { NearContext } from "../../context/NearContext";

import Info from "./Info/Info";
import Screen from "./Screen/Screen";
import Animation from "./Animation/Animation";

export default () => {
  const nearContext = useContext(NearContext);
  const {
    color,
    backgroundColor,
    setColor,
    setBackgroundColor,
  } = useCharacter();
  const useContract = useContext(ContractContext);
  const { creating, info, error } = useContract;

  if (!nearContext.user) {
    return <Redirect to="/" />;
  }

  if (creating) {
    return <Animation color={color} backgroundColor={backgroundColor} />;
  }

  if (info) {
    const [name, id] = info;
    return (
      <Redirect
        to={{
          pathname: "/@" + name,
          hash: id,
        }}
      />
    );
  }

  return (
    <div className="generation">
      <h1 className="head">Create a Corgi</h1>
      {error && <p>{error}</p>}
      <div className="content">
        <Info
          setColor={setColor}
          color={color}
          backgroundColor={backgroundColor}
          setBackgroundColor={setBackgroundColor}
        />
        <Screen color={color} backgroundColor={backgroundColor} />
      </div>
      <style>{`
        .generation {
            max-width: 1100px;
            width: 96%;
            text-align: center;
            margin: auto;
          }
          
          .head {
            font-weight: 600;
          }
          
          .content {
            display: flex;
            flex-direction: row;
          }
          
          @media all and (max-width: 765px) {
            .content {
              flex-direction: column;
            }
          }
        `}</style>
    </div>
  );
};
