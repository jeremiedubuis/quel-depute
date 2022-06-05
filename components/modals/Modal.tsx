import styles from './Modal.module.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { FiX } from 'react-icons/fi';

export const Modal: React.FC<{
    children: React.ReactNode | React.ReactNode[];
    isVisible?: boolean;
    close?: Function;
}> = ({ children, isVisible, close }) => {
    return isVisible
        ? ReactDOM.createPortal(
              <div className={styles.modal} onClick={() => close()}>
                  <button onClick={() => close()}>
                      <FiX />
                  </button>
                  <div onClick={(e) => e.stopPropagation()}>{children}</div>
              </div>,
              document.body
          )
        : null;
};
