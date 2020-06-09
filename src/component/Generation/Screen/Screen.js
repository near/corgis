import React from "react";

import Egg from "../../utils/Egg";
import raritySample from "../../../assets/images/rarity-sample.svg";
import shadow from "../../../assets/images/shadow.svg";

let tinycolor = require("tinycolor2");

export default ({ backgroundColor, color }) => {
  let textColor = tinycolor
    .mostReadable(backgroundColor, [color, "#fff", "#000"])
    .toHexString();

  return (
    <div className="board">
      <div className="screen">
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
        <img
          src={shadow}
          alt=""
          style={{
            position: "relative",
            top: "-10px",
            margin: "10px auto",
            width: "147px",
          }}
        />
      </div>
      <img src={raritySample} alt="" />
      <style>{`
            .screen {
              background-color: ${backgroundColor};
              border-radius: 10px;
              padding: 5%;
              margin-bottom: 5%;
              text-align: center;
            }

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
