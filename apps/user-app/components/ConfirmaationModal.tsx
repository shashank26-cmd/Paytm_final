import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

interface ConfirmationModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  handleClose: () => void;
}

const ConfirmationModal = ({ children, isOpen, handleClose }: ConfirmationModalProps) => {
  const [modalContainer, setModalContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let container = document.getElementById("react-portal-modal-container");

    if (!container) {
      container = document.createElement("div");
      container.id = "react-portal-modal-container";
      document.body.appendChild(container);
    }

    setModalContainer(container);
  }, []);

  useEffect(() => {
    const closeOnEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", closeOnEscapeKey);
    return () => document.removeEventListener("keydown", closeOnEscapeKey);
  }, [handleClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !modalContainer) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {children}
      
      </div>
    </div>,
    modalContainer
  );
};

export default ConfirmationModal;
