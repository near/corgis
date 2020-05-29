import React, { useContext, useReducer, useCallback } from "react";

import { NearContext } from "../../../../context/NearContext";
import { ContractContext } from "../../../../hooks/contract";

import * as nearlib from "near-api-js";

import Button from "../../../utils/Button";

import {
  IoIosCheckmarkCircleOutline,
  IoIosCloseCircleOutline,
} from "react-icons/io";

const initialState = {
  found: false,
  receiver: null,
  error: null,
};

const transferReducer = (currentState, action) => {
  switch (action.type) {
    case "FOUND_RECEIVER":
      return {
        ...currentState,
        found: true,
        receiver: action.receiver,
      };
    case "NOT_FOUND":
      return {
        ...currentState,
        found: false,
      };
    case "FAIL":
      return {
        ...currentState,
        error: action.error,
      };
    default:
      return initialState;
  }
};

export default () => {
  const nearContext = useContext(NearContext);
  const connection = nearContext.nearContent.connection;
  const useContract = useContext(ContractContext);
  const { transferCorgi, error } = useContract;

  const [transfer, dispatchTransfer] = useReducer(
    transferReducer,
    initialState
  );

  const id = window.location.hash.slice(1);

  const checkAccountLegit = useCallback(
    async (value) => {
      try {
        let result = !!(await new nearlib.Account(connection, value).state());
        if (result) {
          dispatchTransfer({ type: "FOUND_RECEIVER" });
        } else {
          dispatchTransfer({ type: "NOT_FOUND" });
        }
      } catch (error) {
        dispatchTransfer({ type: "FAIL", error });
      }
    },
    [connection]
  );

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();

      const { receiver, message } = e.target.elements;
      checkAccountLegit(receiver);
      if (transfer.receiver) {
        transferCorgi(transfer.receiver, id, message);
      }
    },
    [checkAccountLegit, id, transfer.receiver, transferCorgi]
  );
  let styleSender = {
    display: "inline",
    marginLeft: "5px",
    background: "#FFFFFF",
    boxShadow: "0 2px 4px 0 rgba(0,0,0,0.50)",
    borderRadius: "5px",
    color: "#4A4F54",
    letterSpacing: "0",
    textAlign: "start",
    width: "60%",
  };
  let styleMes = {
    display: "inline",
    marginLeft: "5px",
    background: "#FFFFFF",
    boxShadow: "0 2px 4px 0 rgba(0,0,0,0.50)",
    borderRadius: "5px",
    color: "#4A4F54",
    letterSpacing: "0",
    textAlign: "start",
    width: "80%",
  };
  let styleIconWrong = {
    position: "relative",
    left: "-30px",
    fontSize: "1.5rem",
    color: "Salmon",
  };
  let styleIconCorrect = {
    position: "relative",
    left: "-30px",
    fontSize: "1.5rem",
    color: "#78e3a7",
  };
  let icon = (
    <label>
      <IoIosCloseCircleOutline style={styleIconWrong} />
    </label>
  );
  if (transfer.found) {
    icon = (
      <label>
        <IoIosCheckmarkCircleOutline style={styleIconCorrect} />
      </label>
    );
  }
  return (
    <div>
      <form onSubmit={onSubmit}>
        <div style={{ textAlign: "left", marginBottom: "3px" }}>
          <label>To: </label>
          <input
            autoComplete="off"
            autoFocus
            required
            id="receiver"
            type="text"
            placeholder="Corgi receiver"
            style={styleSender}
          />
          {icon}
        </div>
        <div style={{ textAlign: "left" }}>
          <label>Text: </label>
          <textarea
            id="message"
            type="text"
            placeholder="(Optional)Best wish to your friend!"
            style={styleMes}
            maxLength="140"
          />
        </div>
        <div style={{ marginTop: "5px", marginBottom: "10px" }}>
          <Button
            description="Send"
            style={{ display: "block" }}
            disabled={!transfer.found}
          />
          {transfer.error && <p>{transfer.error}</p>}
        </div>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};
