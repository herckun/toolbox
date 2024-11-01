import { useState, type ReactElement } from "react";
import { createPortal } from "react-dom";
import type { JsxElement } from "typescript";

export const ButtonWithConfirmation = (props: {
  className: string;
  value: ReactElement | string;
  extraInfo?: string;
  callback: () => void;
}) => {
  const [showModal, setShowModal] = useState(false);
  const switchShowModal = () => {
    setShowModal(!showModal);
  };

  const handleConfirm = () => {
    switchShowModal();
    props.callback();
  };

  const modal = (
    <div className="fixed backdrop-blur-md bg-base-300/50 w-screen h-screen top-0 left-0 z-40 flex place-content-center place-items-center flex-col">
      <div className="p-4 gap-4 rounded-box bg-gradient-to-l from-base-100 to-base-200 py-6 px-4 border border-base-content/10 relative flex place-content-center place-items-center flex-col max-w-96 max-w-screen mx-2">
        <h1 className="text-lg font-semibold">Are you sure?</h1>
        <p className="text-base-content/80 text-xs font-light">
          {props.extraInfo}
        </p>
        <div className="flex flex-wrap place-content-center place-items-center items-center gap-1">
          <button onClick={handleConfirm} className="btn btn-sm btn-primary">
            Yes, do it
          </button>
          <button onClick={switchShowModal} className="btn btn-sm btn-ghost">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {showModal && createPortal(modal, document.body)}

      <button onClick={switchShowModal} className={props.className}>
        {props.value}
      </button>
    </div>
  );
};
