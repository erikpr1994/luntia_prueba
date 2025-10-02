"use client";

import { useState } from "react";
import Modal from "./Modal";
import CSVUpload from "./CSVUpload";

interface CSVUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataType: "volunteers" | "members" | "shifts" | "donations" | "activities";
  onUploadComplete?: () => void;
}

const DATA_TYPE_LABELS = {
  volunteers: "Voluntarios",
  members: "Miembros",
  shifts: "Turnos",
  donations: "Donaciones",
  activities: "Actividades",
};

export default function CSVUploadModal({
  isOpen,
  onClose,
  dataType,
  onUploadComplete,
}: CSVUploadModalProps) {
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleUploadComplete = () => {
    setUploadComplete(true);
    if (onUploadComplete) {
      onUploadComplete();
    }

    // Close modal after a short delay to show success message
    setTimeout(() => {
      onClose();
      setUploadComplete(false);
    }, 2000);
  };

  const handleClose = () => {
    setUploadComplete(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Subir ${DATA_TYPE_LABELS[dataType]} - CSV`}
      size="large"
    >
      <div style={{ padding: "0" }}>
        <CSVUpload
          dataType={dataType}
          onUploadComplete={handleUploadComplete}
        />
      </div>
    </Modal>
  );
}
