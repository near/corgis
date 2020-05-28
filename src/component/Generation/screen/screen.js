import React from "react";

import raritySample from "../../../assets/images/rarity-sample.svg";
import egg from "../../../assets/images/egg.svg";
import shadow from "../../../assets/images/shadow.svg";

let tinycolor = require("tinycolor2");

export default ({ backgroundColor, color }) => {
  let corgiEgg = (
    <div
      style={{
        width: "100%",
        height: "100%",
        margin: "auto",
        position: "relative",
        zIndex: "10",
      }}
    >
      <img src={egg} alt="" />
    </div>
  );
  let corgiShadow = (
    <div
      style={{
        width: "60%",
        position: "relative",
        top: "-10px",
        margin: "auto",
      }}
    >
      <img src={shadow} alt="" />
    </div>
  );

  let style = {
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
        {corgiEgg}
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
