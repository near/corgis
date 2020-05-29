import React, { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";

import { NearContext } from "../../context/NearContext";
import { ContractContext } from "../../hooks/contract";

import { BigCard } from "../CorgiCard/Card";
import Send from "./Send/Send";
import Share from "./Share/Share";

import Spinner from "../utils/Spinner";
import Rate from "../utils/Rate";

export default () => {
  const nearContext = useContext(NearContext);
  const useContract = useContext(ContractContext);
  const { corgi, loading, getCorgi, transfering } = useContract;
  const id = window.location.hash.slice(1);
  useEffect(() => {
    if (id) {
      getCorgi(id);
    }
  }, [getCorgi, id]);

  const [show, setShow] = useState(false);
  const openModal = () => {
    setShow(true);
  };
  const closeModal = () => {
    setShow(false);
  };

  if (!nearContext.user) {
    return <Redirect to="/" />;
  }
  if (loading) {
    return <Spinner />;
  }
  if (!id) {
    return <Redirect to="/account" />;
  }
  return (
    <div>
      <Send
        corgi={corgi}
        transfering={transfering}
        show={show}
        closeModal={closeModal}
      />
      <Share corgi={corgi} closeModal={closeModal} show={show} />
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
        <div className="wrapperS">
          <Rate rate={corgi.rate} />
          <SendAndShare openModal={openModal} />
        </div>
      </div>
      <style>{`
        .wrapperS {
          width: 70%;
          max-width: 800px;
          margin: 2% auto;
          display: flex;
          justify-content: space-between;
      }
      
      .card {
          background-color: azure;
          margin: 3%;
          padding: 2%;
          display: flex;
          border-radius: 5px;
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
          cursor: pointer;
      }
      
      .cardChar {
          color: #2b73c7;
      }
      
      .text {
          margin-left: 10px;
          display: inline-block;
          width: 200px;
          text-align: left;
          padding: 0;
      }
      
      .small {
          display: none;
      }
      
      @media all and (max-width: 415px) {
          .text {
              display: none;
          }
      
          .small {
              font-size: 1rem;
              display: inline;
              color: #2b73c7;
          }
      }
      `}</style>
    </div>
  );
};

const SendAndShare = ({ openModal }) => {
  let style = { display: "flex", flexDirection: "column", width: "300px" };
  return (
    <div>
      <h5>What would you like to do with </h5>
      <span style={style}>
        <SendCard clicked={openModal} />
        <ShareCard clicked={openModal} />
      </span>
    </div>
  );
};

const SendCard = ({ clicked }) => {
  return (
    <button className="card" onClick={clicked}>
      send icon
      <div className="small">Send</div>
      <div className="text">
        <h3 className="cardChar">Send as a gift</h3>
        <p>The perfect gift for any occasion</p>
      </div>
    </button>
  );
};

const ShareCard = ({ clicked }) => {
  return (
    <button className="card" onClick={clicked}>
      share icon
      <div className="small">Share</div>
      <div className="text">
        <h3 className="cardChar">Share on Social</h3>
        <p>Got something rare? It is time to brag a bit.</p>
      </div>
    </button>
  );
};
