import styles from './Modal.module.css';
import React from 'react';
import ReactDOM from 'react-dom';

export const Modal: React.FC<{
    children: React.ReactNode | React.ReactNode[];
    isVisible?: boolean;
    close?: Function;
}> = ({ children, isVisible, close }) => {
    return isVisible
        ? ReactDOM.createPortal(
              <div className={styles.modal} onClick={() => close()}>
                  <div onClick={(e) => e.stopPropagation()}>{children}</div>
              </div>,
              document.body
          )
        : null;
};
