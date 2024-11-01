import React from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed backdrop-blur-md bg-base-300/90 w-screen h-screen top-0 left-0 z-40 flex place-content-center place-items-center flex-col py-2  md:py-24"
      onClick={onClose}
    >
      <div
        className="p-4 gap-4 rounded-box bg-gradient-to-l overflow-y-auto from-base-100 to-base-200 py-6 px-4 border border-base-content/10 relative flex place-content-start place-items-center flex-col max-w-[99vw] mx-2 w-fit h-fit min-h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 btn btn-ghost btn-xs"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>,
    document.body, // This renders the modal into the body element
  );
};

export default Modal;
