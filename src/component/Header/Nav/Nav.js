import React from "react";
import { NavLink } from "react-router-dom";

import Button from "../../utils/Button";
import IconNav from "../../../assets/images/icon-nav.svg";

export default ({ number, accountName, requestSignOut }) => {
  return (
    <div className="wrap">
      <div className="account">
        <NavLink to="/account">
          <Button description={`My Corgis ( ${number} )`} />
        </NavLink>
        <Card accountName={accountName} requestSignOut={requestSignOut} />
      </div>
      <NavLink to="/generation">       
        <AddCorgi />
      </NavLink>
      <style>{`
        .wrap {
          margin: auto;
          padding: 5px 30px;
          display: inline-flex;
          font-size: 1em;
        }
        
        .account{
          display: inline-flex;
          flex-direction: row;
        }
        
        .menutop {
          border-radius: 5px;
          border: 2px solid #fbb040;
          background-color: #fff;
          padding: 5px 30px;
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
          cursor: grabbing;
        }
        
        .dropdown {
          position: relative;
          display: inline-block;
          margin: 0 15px;
        }
        
        .dropdown-content {
          display: none;
          position: absolute;
          background-color: #fdfcfc;
          width: 100%;
          z-index: 1;
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
          border-radius: 0 0 5px 5px;
        }
        
        .dropdown:hover .dropdown-content {
          display: block;
        }
        
        .menutop:hover .menutop {
            border: none;
            border-radius: 5px 5px 0 0;
        }
        
        li.active {
          background: #dddddd;
        }
        
        .orange {
          color: #fbb040;
          display: inline;
        }
        
        @media all and (max-width: 1200px) {
          .wrap{
            font-size: 0.8em;
          }
          .menutop {
            padding: 5px;
          }
        }
        
        @media all and (max-width: 450px) {
          .wrap{
            font-size: 0.6em;
          }
          .account{
            flex-direction: row;
          }
          .menutop {
            padding: 8px 3px;
          }
        }
      `}</style>
    </div>
  );
};

const Card = ({ accountName, requestSignOut }) => {
  let style = {
    textDecoration: "none",
    display: "block",
    padding: "auto",
    color: "#01c9fd",
    margin: "2%  auto",
    cursor: "alias",
  };
  return (
    <div className="dropdown">
      <button className="menutop">@{accountName}▾</button>
      <div className="dropdown-content">
        <ul style={{ textAlign: "center", padding: "2px", marginBottom: "0" }}>
          <li style={style}>
            <NavLink to="/profile">
              <button>Edit Profile</button>
            </NavLink>
          </li>
          <li style={style}>
            <button onClick={requestSignOut}>Sign Out</button>
          </li>
        </ul>
      </div>
    </div>
  );
};

const AddCorgi = () => (
  <div
    style={{
      boxShadow: "0 2px 2px 0 rgba(0, 0, 0, 0.5)",
      borderRadius: "50%",
      height: "40px",
      width: "40px",
    }}
  >
    <img src={IconNav} alt="" />
  </div>
);
