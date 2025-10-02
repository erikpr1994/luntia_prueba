"use client";

import { useEffect } from "react";
import styles from "./Modal.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "small" | "medium" | "large";
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "medium",
}: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div
        className={styles.modalContent}
        style={{
          maxWidth:
            size === "small" ? "400px" : size === "large" ? "800px" : "600px",
        }}
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className={styles.modalCloseButton}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className={styles.modalBody}>{children}</div>

        {footer && <div className={styles.modalFooter}>{footer}</div>}
      </div>
    </div>
  );
}
