import './Dialog.scss';
import React, { useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";

interface DialogProps {
  heading: string;
  date?: string;
  isOpen: boolean;
  onClose: () => void;
  user?: any;
  id?: string;
  editedDate?: string;
  editPost?: (id: string) => void;
  deletePost?: (id: string) => void;
  children?: React.ReactNode;
  fullScreen?: boolean;
  confirmationDialog?: boolean;
}

const Dialog: React.FC<DialogProps> = ({ heading, date, isOpen, onClose, user, id, editedDate, editPost, deletePost, children, fullScreen, confirmationDialog }) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={`dialog-overlay ${fullScreen ? 'full-screen-dialog' : ''}`}>
      <div className={`dialog-content ${fullScreen ? 'full-screen' : ''}`} ref={dialogRef}
           onClick={(e) => e.stopPropagation()}>
        <div className={`dialog-heading ${confirmationDialog ? 'centered' : ''}`}>
          {heading}
          <IoClose className={'close-icon'} onClick={onClose}/>
        </div>
        <div className={'date-container'}>
          {date}
          {user && editPost && deletePost && (
            <div className={'post-actions'}>
              <button className={'painike'} onClick={() => editPost(id)}>Muokkaa</button>
              <button className={'painike destructive'} onClick={() => deletePost(id)}>Poista</button>
            </div>
          )}
        </div>
        {!confirmationDialog ? <span className={'edited-date'}>{editedDate !== 'Invalid Date' ? `(Muokattu ${editedDate})` : ''}</span> : null}
        <div className={`text-container ${confirmationDialog ? 'centered' : ''}`}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Dialog;
