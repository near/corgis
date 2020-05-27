import React from "react";

import { SmallCard } from "../../CorgiCard/Card";
import Modal from "../../utils/Modal";
import Spinner from "../../utils/Spinner";

import Transfer from "./Transafer/Transfer";

export default ({ corgi, show, closeModal, transfering }) => {
  return (
    <Modal show={show} Close={closeModal}>
      {!transfering ? (
        <div style={{ width: "100%", height: "100%" }}>
          <h3>Send a Corgi</h3>
          <div>
            <div style={{ overflowX: "scroll", width: "100%", height: "90%" }}>
              <SmallCard
                style={{ width: "100%", height: "100%" }}
                backgroundColor={corgi.backgroundColor}
                color={corgi.color}
                sausage={corgi.sausage}
                quote={corgi.uote}
              />
            </div>
            <p style={{ margin: "0" }}>{corgi.name}</p>
            <span style={{ color: "orange", fontSize: "0.7rem" }}>
              {corgi.rate}
            </span>
            <hr />
          </div>
          <Transfer />
        </div>
      ) : (
        <Spinner />
      )}
    </Modal>
  );
};
