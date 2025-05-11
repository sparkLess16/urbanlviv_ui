import React from "react";
import "../styles/ConfirmDialog.css";

const ConfirmDialog = ({ message, buttons = [] }) => {
  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        {Array.isArray(message) ? (
          message.map((line, idx) =>
            idx === 0 ? (
              <p key={idx}>
                <strong>{line}</strong>
              </p>
            ) : (
              <p key={idx}>{line}</p>
            )
          )
        ) : (
          <p>
            <strong>{message}</strong>
          </p>
        )}

        <div className="confirm-buttons">
          {buttons.map((btn, idx) => (
            <button
              key={idx}
              className={btn.variant || "default"}
              onClick={btn.onClick}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
