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
                        z-index: 20;
                        background-color: #f8f8f8;
                        max-width: 600px;
                        width: 60%;
                        height: 70%;
                        max-height: 570px;
                        border: 1px solid #ccc;
                        border-radius: 10px;
                        box-shadow: 1px 1px 1px black;
                        padding: 16px;
                        top: 15%;
                        left: calc((100% - 600px)/2);
                        transition: all 0.3s ease-out;
                        overflow-y: scroll;
                    }
                    
                    @media (max-width:416px) {
                        .Modal {
                            left: 2%;
                        }
                    }
                    .Backdrop {
                        width: 100%;
                        height: 100%;
                        position: fixed;
                        z-index: 10;
                        left: 0;
                        top: 0;
                        background-color: rgba(0, 0, 0, 0.5);
                    }
                `}</style>
    </div>
  );
};
