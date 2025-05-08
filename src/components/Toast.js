import React from 'react';
import PropTypes from 'prop-types';
import '../styles/Toast.css';

function Toast({ message, type = 'info', onClose }) {
  const config = {
    success: {
      label: 'Success',
      icon: (
          <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 17"
              fill="currentColor"
              className="toast__icon"
          >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0
           00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0
           10-1.06 1.061l2.5 2.5a.75.75 0
           001.137-.089l4-5.5z"
            />
          </svg>
      )
    },
    error: {
      label: 'Error',
      icon: (
          <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 17"
              fill="currentColor"
              className="toast__icon"
          >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0
           01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0
           10a1 1 0 100-2 1 1 0 000 2z"
            />
          </svg>
      )
    },
    info: {
      label: 'Info',
      icon: (
          <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 17"
              fill="currentColor"
              className="toast__icon"
          >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0
           11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0
           01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75
           0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75
           1.75 0 009.253 9H9z"
            />
          </svg>
      )
    },
  };
  const { label, icon } = config[type] || config.info;

  return (
      <div className={`toast toast--${type}`}>
        <div className="toast__header">
          {icon}
          <span className="toast__label">{label}</span>
          <button
              onClick={onClose}
              className="toast__close"
              aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="toast__message">{message}</div>
      </div>
  );
}

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success','error','info']),
  onClose: PropTypes.func.isRequired,
};

export default Toast;
