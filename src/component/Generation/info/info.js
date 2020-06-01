import React, { useEffect, useContext } from "react";

import useCharacter from "../../../hooks/character";
import { ContractContext } from "../../../hooks/contract";

import Button from "../../utils/Button";

import { GiGreekSphinx } from "react-icons/gi";
let generate = require("project-name-generator");

export default ({ setColor, color, setBackgroundColor, backgroundColor }) => {
  const { name, quote, setName, setQuote } = useCharacter();
  useEffect(() => setQuote(), [setQuote]);
  const useContract = useContext(ContractContext);
  const { createCorgi } = useContract;

  const generateName = (e) => {
    setName(e.target.value);
  };
  const generateRandomName = () => {
    let name = generate({ words: 2, alliterative: true }).spaced;
    setName(name);
  };
  const generateColor = (e) => {
    setColor(e.target.value);
  };
  const generateBackgroundColor = (e) => {
    setBackgroundColor(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    createCorgi(name, color, backgroundColor, quote);
  };
  return (
    <div className="inputboard">
      <p className="title">My Corgi is called</p>
      <form onSubmit={onSubmit}>
        <div>
          <input
            className="inputname"
            type="text"
            value={name}
            onChange={generateName}
            required
          />
          <GiGreekSphinx
            onClick={generateRandomName}
            style={{
              marginLeft: "5px",
              color: "#a51cea",
              fontSize: "1.5rem",
              borderRadius: "50%",
              boxShadow:
                "0 0 4px 4px rgba(0, 0, 0, 0.5), inset 0 0 5px 2px #ffffff",
              background: "#f5ebff",
              cursor: "pointer",
              marginTop: "10px",
            }}
          />
        </div>
        <p className="title">Colors</p>
        <div>
          <div className="colorpicker">
            <label>
              <div className="result" style={{ backgroundColor: color }}>
                <input
                  type="color"
                  id="colorPicker"
                  value={color}
                  onChange={generateColor}
                  style={{
                    display: "none",
                  }}
                />
                <div className="select">w</div>
              </div>
            </label>
            <div>
              <p
                style={{
                  marginBottom: "0",
                  marginLeft: "2px",
                  fontWeight: "600",
                }}
              >
                Corgi
              </p>
              <p style={{ marginBottom: "0", marginLeft: "2px" }}>{color}</p>
            </div>
          </div>
          <div className="colorpicker">
            <label>
              <div
                className="result"
                style={{ backgroundColor: backgroundColor }}
              >
                <input
                  type="color"
                  id="backgroundcolorPicker"
                  value={backgroundColor}
                  onChange={generateBackgroundColor}
                  style={{
                    display: "none",
                  }}
                />
                <div className="select">w</div>
              </div>
            </label>
            <div>
              <p
                style={{
                  marginBottom: "0",
                  marginLeft: "2px",
                  fontWeight: "600",
                }}
              >
                Background
              </p>
              <p style={{ marginBottom: "0", marginLeft: "2px" }}>
                {backgroundColor}
              </p>
            </div>
          </div>
        </div>
        <Button description="Generate Corgi" />
      </form>
      <p className="quote">
        This will create a one-of-a-kind Corgi that will develop a unique size
        and thought process. The size it grows to will untimately determine it’s
        value
      </p>
      <style>{`
            .inputboard {
                background: #f8f8f8;
                border-radius: 10px;
                padding: 1%;
                text-align: left;
                width: 50%;
                margin: 1%;
              }
              
              .title {
                font-weight: 600;
                font-size: 1.5em;
                margin: 10px 0;
                display: block;
              }
              
              .inputname {
                background: #ffffff;
                box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
                border-radius: 5px;
                width: 80%;
              }
              
              .quote {
                  font-size: 0.7em;
                  font-weight: thin;
                  display: inline-block;
                  margin-top: 20px;
              }
              
              @media all and (max-width: 765px) {
                .inputboard{
                  width: 100%;
                }
              }
              .colorpicker {
                display: flex;
                flex-flow: row;
              }
              
              .result{
                border: 2px solid #24272a;
                box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
                border-radius: 5px;
                width: 50px;
                height: 50px;
                cursor: grab;
              }
              
              #color-picker {
                display: none;
              }
              
              .select {
                cursor: pointer;
                position: relative;
                left: 29px;
                top: 24px;
                z-index: 10;
              }
            `}</style>
    </div>
  );
};
