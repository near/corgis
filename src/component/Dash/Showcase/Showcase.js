import React from "react";
import { Link } from "react-router-dom";
import Creation from "../../creation/creationHome";

export default ({ displayCorgis }) => {
  let Corgis = displayCorgis.map((corgi) => {
    return (
      <Link
        to={{
          pathname: "/showcase",
          hash: corgi.id,
        }}
        key={corgi.id}
      >
        <Creation
          backgroundColor={corgi.backgroundColor}
          color={corgi.color}
          sausage={corgi.sausage}
          name={corgi.name}
          owner={corgi.owner}
          quote={corgi.quote}
        />
      </Link>
    );
  });
  return <div>{Corgis}</div>;
};
