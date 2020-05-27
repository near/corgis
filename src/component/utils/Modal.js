import React from "react";

export default ({ show, Close, children }) => {
  return (
    <div>
      {show ? <div className="Backdrop" onClick={Close}></div> : null}
      <div
        className="Modal"
        style={{
          transform: show ? "translateY(0)" : "translateY(-100vh)",
          opacity: show ? "1" : "0",
        }}
      >
        {children}
      </div>
      <style>{`
                    .Modal {
                        position: fixed;
                        z-index: 500;
                        background-color: #f8f8f8;
                        max-width: 600px;
                        min-width: 270px;
                        width: 60%;
                        height: 70%;
                        border: 1px solid #ccc;
                        border-radius: 5px 10px;
                        box-shadow: 1px 1px 1px black;
                        padding: 16px;
                        top: 20%;
                        left: 30%;
                        transition: all 0.3s ease-out;
                        overflow: scroll;
                    }
                    
                    @media (max-width: 374px) {
                        .Modal {
                            width: 300px;
                            left: 10%;
                        }
                    }
                    .Backdrop {
                        width: 100%;
                        height: 100%;
                        position: fixed;
                        z-index: 100;
                        left: 0;
                        top: 0;
                        background-color: rgba(0, 0, 0, 0.5);
                    }
                `}</style>
    </div>
  );
};
