import React, { useContext, useReducer } from "react";

import { NearContext } from "../../../../context/NearContext";
import { ContractContext } from "../../../../context/contract";

import * as nearlib from "near-api-js";

import Button from "../../../utils/Button";

import {
  IoIosCheckmarkCircleOutline,
  IoIosCloseCircleOutline,
} from "react-icons/io";

const initialState = {
  found: false,
  receiver: undefined,
  message: undefined,
  error: null,
};

const transferReducer = (currentState, action) => {
  switch (action.type) {
    case "FOUND_RECEIVER":
      return {
        ...currentState,
        found: true,
        error: null,
      };
    case "NOT_FOUND":
      return {
        ...currentState,
        found: false,
        error: action.error,
      };
    case "RECEIVER":
      return {
        ...currentState,
        receiver: action.receiver,
      };
    case "MESSAGE":
      return {
        ...currentState,
        message: action.message,
      };
    default:
      return initialState;
  }
};

export default () => {
  const nearContext = useContext(NearContext);
  const connection = nearContext.nearContent.connection;
  const useContract = useContext(ContractContext);
  const { transferCorgi } = useContract;

  const [transfer, dispatchTransfer] = useReducer(
    transferReducer,
    initialState
  );

  const id = window.location.hash.slice(1);

  const checkAccountLegit = async (value) => {
    try {
      let result = !!(await new nearlib.Account(connection, value).state());
      console.log(result);
      if (result) {
        dispatchTransfer({ type: "FOUND_RECEIVER" });
      }
    } catch (error) {
      dispatchTransfer({ type: "NOT_FOUND", error: error.message });
    }
  };

  const setReceiver = (e) => {
    let receiver = e.target.value;
    checkAccountLegit(receiver);
    dispatchTransfer({ type: "RECEIVER", receiver });
  };

  const setMessage = (e) =>
    dispatchTransfer({ type: "MESSAGE", message: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    transferCorgi(transfer.receiver, id, transfer.message);
  };

  let icon = (
    <label>
      <IoIosCloseCircleOutline
        style={{
          position: "relative",
          left: "-30px",
          fontSize: "1.5rem",
          color: "Salmon",
        }}
      />
    </label>
  );
  if (transfer.found) {
    icon = (
      <label>
        <IoIosCheckmarkCircleOutline
          style={{
            position: "relative",
            left: "-30px",
            fontSize: "1.5rem",
            color: "#78e3a7",
          }}
        />
      </label>
    );
  }
  return (
    <div>
      <form onSubmit={onSubmit}>
        <div style={{ textAlign: "left", marginBottom: "3px" }}>
          <label>To: </label>
          <input
            autoFocus
            required
            type="text"
            placeholder="Corgi receiver"
            value={transfer.receiver}
            onChange={setReceiver}
            className="receiver"
          />
          {icon}
        </div>
        <div style={{ textAlign: "left" }}>
          <label>Text: </label>
          <textarea
            placeholder="(Optional)Best wish to your friend!"
            maxLength="140"
            value={transfer.message}
            onChange={setMessage}
            className="message"
          />
        </div>
        <div style={{ marginTop: "5px", marginBottom: "10px" }}>
          <Button description="Send" disabled={!transfer.found} />
        </div>
      </form>
      <style>{`
        .receiver {
          display: inline;
          margin-left: 5px;
          background: #FFFFFF;
          box-shadow: 0 2px 4px 0 rgba(0;0;0;0.50);
          border-radius: 5px;
          color: #4A4F54;
          letterspacing: 0;
          text-align: start;
          width: 60%;
        }
        .message {
          display: inline;
          margin-left: 5px;
          background: #FFFFFF;
          box-shadow: 0 2px 4px 0 rgba(0;0;0;0.50);
          borderradius: 5px;
          color: #4A4F54;
          letter-spacing: 0;
          text-align: start;
          width: 80%;
        };
      `}</style>
    </div>
  );
};
