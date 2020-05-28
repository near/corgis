import React, { useState, useEffect, useContext } from "react";

import useContract from "../../hooks/contract";
import { NearContext } from "../../context/NearContext";

import { CopyToClipboard } from "react-copy-to-clipboard";
import { GiBowTieRibbon, GiImperialCrown } from "react-icons/gi";

import { BigCard } from "../CorgiCard/Card";
import Spinner from "../utils/Spinner";
import Rate from "../utils/Rate";

export default () => {
  const nearContext = useContext(NearContext);
  const [copied, setCopied] = useState(false);
  const { corgi, getCorgi, loading } = useContract();
  const id = window.location.hash.slice(1);
  useEffect(() => {
    if (id) {
      getCorgi(id);
    }
  }, [getCorgi, id]);

  if (loading) {
    return <Spinner />;
  }
  const address = window.location.origin + "/share" + window.location.hash;
  const sausage = Number(corgi.sausage).toFixed(4);
  let style = {
    width: "70%",
    maxWidth: "800px",
    margin: "2% auto",
    display: "flex",
    justifyContent: "space-between",
  };
  let poster = (
    <p>
      Do you want to have corgi yourself? click Get started and enjoy the
      advanture!
    </p>
  );
  if (!nearContext.user) {
    poster = <p>Create your own and share</p>;
  }
  return (
    <div>
      <h1>Meet {corgi.name}!</h1>
      <div>
        <BigCard
          backgroundColor={corgi.backgroundColor}
          color={corgi.color}
          sausage={corgi.sausage}
          quote={corgi.quote}
        />
      </div>
      <div style={style}>
        <Rate rate={corgi.rate} name={corgi.name} />
        <div>
          <h5>
            <GiImperialCrown style={{ color: "#9437ff", fontSize: "1.1rem" }} />
            Owner: {corgi.owner}
          </h5>
          <h5>
            <GiBowTieRibbon style={{ color: "#9437ff", fontSize: "1.2rem" }} />
            Sausage: {sausage}
          </h5>
        </div>
      </div>
      <div style={{ marginBottom: "10px" }}>
        {poster}
        <p
          style={{
            backgroundColor: "white",
            borderRadius: "5px",
            padding: "4px 2px",
            wordWrap: "break-word",
          }}
        >
          Do you also want to share {corgi.name}?
        </p>
        <CopyToClipboard text={address} onCopy={() => setCopied(true)}>
          <button
            style={{
              backgroundColor: "#fbb040",
              color: "#f2f2f2",
              borderRadius: "5px",
              padding: "4px 2px",
              cursor: "alias",
              boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.5)",
            }}
          >
            Copy Link
          </button>
        </CopyToClipboard>
        {copied && (
          <span style={{ color: "#961be0", marginLeft: "5px" }}>Copied.</span>
        )}
      </div>
    </div>
  );
};
