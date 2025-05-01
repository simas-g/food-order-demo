import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
export default function Modal({ children, onClose, open, className = "" }) {
  const dialog = useRef();
  useEffect(() => {
    const modal = dialog.current;
    if (open) {
      modal.showModal();
    }
    return () => {
      modal.close();
    };
  }, [open]);
  return createPortal(
    <dialog onClose={onClose} ref={dialog} className={`modal ${className}`}>
      {children}
    </dialog>,
    document.getElementById("modal")
  );
}
