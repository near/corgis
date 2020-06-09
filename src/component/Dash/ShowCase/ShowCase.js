import { Link } from "react-router-dom";
import React from "react";

import DashCard from "./DashCard/DashCard";

export default ({ displayCorgis }) => {
  let Corgis = displayCorgis.map((corgi) => {
    return (
      <Link
        to={{
          pathname: "/share",
          hash: corgi.id,
        }}
        key={corgi.id}
      >
        <DashCard corgi={corgi} />
      </Link>
    );
  });
  return <div>{Corgis}</div>;
};
