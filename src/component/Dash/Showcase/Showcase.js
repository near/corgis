import React from "./node_modules/react";
import { Link } from "./node_modules/react-router-dom";
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
