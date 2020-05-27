import React from "react";
import { Redirect, Link } from "react-router-dom";

import { TiDelete } from "react-icons/ti";
import {
  GiDiscussion,
  GiJumpingDog,
  GiDogBowl,
  GiGlassBall,
} from "react-icons/gi";

import Common from "../../utils/corgiPhoto/Common";
import Uncommon from "../../utils/corgiPhoto/Uncommon";
import Rare from "../../utils/corgiPhoto/Rare";
import VeryRare from "../../utils/corgiPhoto/VeryRare";

export default ({ corgi, deleteCorgi }) => {
  if (!corgi) {
    return <Redirect to="/profile" />;
  }
  const rate = corgi.rate;
  let show = "ULTRA RARE";

  if (rate === "COMMON") {
    show = <Common color={corgi.color} />;
  } else if (rate === "UNCOMMON") {
    show = <Uncommon color={corgi.color} />;
  } else if (rate === "RARE") {
    show = <Rare color={corgi.color} />;
  } else if (rate === "VERY RARE") {
    show = <VeryRare color={corgi.color} />;
  }
  return (
    <div
      style={{
        margin: "5px",
        display: "flex",
        flexBasis: "row wrap",
        justifyContent: "center",
      }}
    >
      <Link
        to={{
          pathname: "/@" + corgi.name,
          hash: corgi.id,
        }}
        key={corgi.id}
      >
        {show}
      </Link>
      <div style={{ marginLeft: "10px", width: "50%", textAlign: "left" }}>
        <div>
          <GiGlassBall style={{ color: "#9437ff" }} /> {corgi.rate}
          <GiJumpingDog style={{ color: "#9437ff" }} />
          {corgi.name}
          <GiDogBowl style={{ color: "#9437ff" }} />
          from: {corgi.sneder ? corgi.sender : "NEAR"}
          <TiDelete
            onClick={deleteCorgi}
            style={{ marginLeft: "5px", color: "#ff4143", fontSize: "2rem" }}
          />
        </div>
        <p>
          <GiDiscussion style={{ color: "#9437ff" }} />
          {corgi.message ? corgi.message : "This lovely corgi is for you"}
        </p>
      </div>
    </div>
  );
};
