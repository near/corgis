import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import * as nearlib from "near-api-js";

import Button from "../common/Button/Button";

import {
  IoIosCheckmarkCircleOutline,
  IoIosCloseCircleOutline,
} from "react-icons/io";

import { DEFAULT_GAS_VALUE } from "../../container/App/App";

//message needs to be added
class TransferCorgi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipient: "",
      message: "",
      found: false,
    };
  }

  checkAccountAvailable = async (value) => {
    try {
      let result = !!(await new nearlib.Account(
        window.near.connection,
        value
      ).state());
      if (result) {
        this.setState({ found: true });
      }
      console.log(result);
    } catch (e) {
      this.setState({ found: false });
      console.log(e.message);
    }
  };

  handleNameChange = (event) => {
    let value = event.target.value;
    this.checkAccountAvailable(value);
    this.setState({ recipient: value });
  };

  handleMessageChange = (event) => {
    let value = event.target.value;
    this.setState({ message: value });
  };

  transferCorgi = (e) => {
    let {
      loadingHandler,
      contract,
      dna,
      history,
      handleChange,
      accountId,
    } = this.props;
    let { recipient, message } = this.state;
    e.preventDefault();
    loadingHandler();
    contract
      .transfer(
        {
          to: recipient,
          tokenId: dna,
          message,
          sender: accountId,
        },
        DEFAULT_GAS_VALUE
      )
      .then((response) => {
        console.log("[transfer.js] corgis", response.len);
        let newCorgis = response.corgis;
        handleChange({ name: "corgis", value: newCorgis });
        loadingHandler();
        history.push("/account");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    let { recipient, message, found } = this.state;
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
    if (found) {
      icon = (
        <label>
          <IoIosCheckmarkCircleOutline style={styleIconCorrect} />
        </label>
      );
    }
    return (
      <div>
        <form onSubmit={this.transferCorgi}>
          <div style={{ textAlign: "left", marginBottom: "3px" }}>
            <label>To: </label>
            <input
              required
              id="recipient"
              type="text"
              placeholder="Corgi recipient"
              onChange={this.handleNameChange}
              value={recipient}
              style={styleSender}
              maxLength="32"
            />
            {icon}
          </div>
          <div style={{ textAlign: "left" }}>
            <label>Text: </label>
            <textarea
              id=""
              type="text"
              placeholder="(Optional)Best wish to your friend!"
              onChange={this.handleMessageChange}
              value={message}
              style={styleMes}
              maxLength="140"
            />
          </div>
          <div style={{ marginTop: "5px", marginBottom: "10px" }}>
            <Button
              description="Send"
              style={{ display: "block" }}
              disabled={!found}
            />
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(TransferCorgi);
