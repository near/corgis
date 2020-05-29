import React from "react";

import Egg from "../../utils/Egg";
import raritySample from "../../../assets/images/rarity-sample.svg";
import shadow from "../../../assets/images/shadow.svg";

let tinycolor = require("tinycolor2");

export default ({ backgroundColor, color }) => {
  const corgiShadow = (
    <img
      src={shadow}
      alt=""
      style={{
        width: "60%",
        position: "relative",
        top: "-10px",
        margin: "auto",
      }}
    />
  );

  const style = {
    backgroundColor,
    borderRadius: "10px",
    padding: "5%",
    marginBottom: "5%",
    textAlign: "center",
  };
  let textColor = tinycolor
    .mostReadable(backgroundColor, [color, "#fff", "#000"])
    .toHexString();

  return (
    <div className="board">
      <div style={style}>
        <p style={{ color: textColor, fontWeight: "600" }}>
          All corgis come equipped with built-in cuteness and an unlimited
          capacity to love.
        </p>
        <p
          style={{ color: textColor, fontWeight: "600", marginBottom: "20px" }}
        >
          Just choose a name and a few colors and we’ll do the rest.
        </p>
        <Egg color={color} />
        {corgiShadow}
      </div>
      <img src={raritySample} alt="" />
      <style>{`
            .board {
                width: 100%;
                margin: 1% ;
            }
            
            .white {
                color: #fff;
                filter: brightness(50%);
            }
            
            .bold {
                font-weight: 600;
            }
            
            .marginB {
                margin-bottom: 30px;
            }
        `}</style>
    </div>
  );
};
