import './Dialog.scss';
import React, { useEffect } from "react";
import { IoClose } from "react-icons/io5";

interface DialogProps {
  heading: string;
  date: string;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  fullScreen: boolean;
}

const Dialog: React.FC<DialogProps> = ({ heading, date, isOpen, onClose, children, fullScreen }) => {
  useEffect(() => {
    const handleBodyScroll = () => {
      if (fullScreen && isOpen) {
        document.body.classList.add('dialog-open');
      } else {
        document.body.classList.remove('dialog-open');
      }
    };

    handleBodyScroll();

    return () => {
      document.body.classList.remove('dialog-open');
    };
  }, [fullScreen, isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`dialog-overlay ${fullScreen ? 'full-screen-dialog' : ''}`} onClick={onClose}>
      <div className={`dialog-content ${fullScreen ? 'full-screen' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className={'dialog-heading'}>
          {heading}
          <IoClose className={'close-icon'} onClick={onClose}/>
        </div>
        <div className={'date-container'}>{date}</div>
        <div className={'text-container'}>
          {children}
        </div>
      </div>
    </div>
  );
}


export default Dialog;
