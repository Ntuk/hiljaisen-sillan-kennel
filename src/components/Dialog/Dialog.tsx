import './Dialog.scss';
import React from "react";
import { IoClose } from "react-icons/io5";

interface DialogProps {
  heading: string;
  date: string;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ heading, date, isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className={'dialog-overlay'} onClick={onClose}>
      <div className={'dialog-content'} onClick={(e) => e.stopPropagation()}>
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
