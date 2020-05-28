import React from "./node_modules/react";
import { Keyframes, Frame } from "./node_modules/react-keyframes";

import {
  corgiOne,
  corgiTwo,
  corgiThree,
  corgiFour,
} from "../../utils/corgiAnimation";
import raritySample from "../../../assets/images/shadow.svg";
import shadow from "../../../assets/images/shadow.svg";

export default ({ color, backgroundColor }) => (
  <div>
    <h3>Generating...</h3>
    <div
      style={{
        background: backgroundColor,
        borderRadius: "10px",
        height: "50%",
        width: "86%",
        maxWidth: "1100px",
        margin: "5% auto",
        padding: "10%",
      }}
    >
      <Keyframes>
        <Frame duration={1000} component={corgiOne}></Frame>
        <Frame duration={1000} component={corgiTwo}></Frame>
        <Frame duration={1000} component={corgiThree}></Frame>
        <Frame duration={1000} component={corgiFour}></Frame>
      </Keyframes>
      <div className="shadow">
        <img src={shadow} alt="" />
      </div>
    </div>
    <img src={raritySample} alt="" />
    <style>{`
          .shadow {
            width: 100%;
            position: relative;
            top: 40px;
            margin: auto;
          }
          .spinning {
            animation-name: spin;
            animation-duration: 1000ms;
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
